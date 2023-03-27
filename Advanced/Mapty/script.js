'use strict';

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  click = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  _onClick() {
    this.click++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

///////////////////////////////////////////////
// Functionality

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const btnDeleteAll = document.querySelector('.btn__delete-all');
const btnShowAll = document.querySelector('.btn__show-all');
const btnSort = document.querySelector('.btn__sort');
const sortInput = document.querySelector('.sort__input');
const errorMessage = document.querySelector('.error-message');
const message = document.querySelector('.message');

let allWorkout,
  polyline,
  isSorted = false,
  show = false;

class App {
  #map;
  #mapZoomLevel = 15;
  #mapEvent;
  #workouts = [];
  #markers = [];

  constructor() {
    // Get position
    this._getPosition();

    // Get data form local storage
    this._getLocalStorage();

    // Event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevetionFiled);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    containerWorkouts.addEventListener('click', this._deleteWorkout.bind(this));
    // containerWorkouts.addEventListener('click', this._editWorkout.bind(this));
    btnDeleteAll.addEventListener('click', this._reset.bind(this));
    btnShowAll.addEventListener('click', this._showAllMarker.bind(this));
    btnSort.addEventListener('click', this._sort.bind(this));
    sortInput.addEventListener('change', this._sort.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        this._showErrorMessage('Dont allow to access location');
      });
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Whenever user click on the map
    this.#map.on('click', this._showForm.bind(this));

    // Render the workout marker
    this.#workouts.forEach(work => this._randerWorkoutMarker(work));

    // this._polyline();
  }

  async _getCityName(workout) {
    console.log('calling');
    try {
      const [lat, lng] = workout.coords;

      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=ee19f03a51414938b6e200939231303&q=${lat},${lng}`
      );
      const data = await response.json();
      console.log(data);
      console.log(`${data.location.name}, ${data.location.country}`);
      console.log(`${data.current.temp_c}, ${data.current.condition.text}`);
      return `${data.location.name}, ${data.location.country}`;
    } catch (err) {
      throw err.message;
    }
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Clear input filds
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevetionFiled() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPosities = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPosities(distance, duration, cadence)
      )
        return this._showErrorMessage('Input have to be positive numbers.');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPosities(distance, duration)
      )
        return this._showErrorMessage('Input have to be positive numbers.');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to the workout array
    this.#workouts.push(workout);

    // Render workout on list
    this._randerWorkout(workout);

    // Render workout on map as Marker
    this._randerWorkoutMarker(workout);

    // Hide the form
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();

    // If, sorted the unsort
    isSorted = true;
    this._sort();
  }

  _randerWorkoutMarker(workout) {
    // const location = await this._getCityName(workout);
    this._getCityName(workout);

    const myIcon = L.icon({
      iconUrl: 'icon.png',
      iconSize: [38, 38],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });

    const marker = L.marker(workout.coords, {
      icon: myIcon,
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();

    // Push marker in markers array
    this.#markers.push(marker);
  }

  _showAllMarker() {
    if (!show) {
      btnShowAll.classList.add('active');
      // LatLngBounds object that includes all the markers
      const bounds = L.latLngBounds([
        this.#markers.map(marker => marker.getLatLng()),
      ]);
      this.#map.fitBounds(bounds);
    }

    if (show) {
      btnShowAll.classList.remove('active');

      // Get the user's current position and display it on the map
      navigator.geolocation.getCurrentPosition(function (position) {
        // Center the map on the user's current position
        app.#map.setView(
          [position.coords.latitude, position.coords.longitude],
          app.#mapZoomLevel
        );
      });
    }

    show = !show;
  }

  _removeWorkoutMarker(marker) {
    this.#map.removeLayer(marker);
  }

  _randerWorkout(workout) {
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <div class="btns">
            <button class="btn btn__edit">Edit</button>
            <button class="btn btn__delete">Delete</button>
          </div>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <spna class="workout__unit">km</spna>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <spna class="workout__unit">min</spna>
          </div>
    `;

    if (workout.type === 'running')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <spna class="workout__unit">min/km</spna>
          </div>

          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <spna class="workout__unit">spm</spna>
          </div>
        </li>
    `;

    if (workout.type === 'cycling')
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <spna class="workout__unit">km/h</spna>
          </div>

          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <spna class="workout__unit">m</spna>
          </div>
        </li>
     `;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    const btnsEl = e.target.closest('.btns');

    if (!workoutEl || btnsEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // Icrease click
    workout._onClick();
    console.log(workout.click);
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    const previousWorkouts = data;

    this.#workouts = previousWorkouts.map(work => {
      let workout;
      if (work.type === 'running') {
        workout = new Running(
          work.coords,
          work.distance,
          work.duration,
          work.cadence
        );
      }

      if (work.type === 'cycling') {
        workout = new Cycling(
          work.coords,
          work.distance,
          work.duration,
          work.elevationGain
        );
      }
      workout.id = work.id;
      workout.click = work.click;
      workout.location = work.location;
      return workout;
    });

    this.#workouts.forEach(work => this._randerWorkout(work));
  }

  _deleteWorkout(e) {
    const deleteBtnEl = e.target.closest('.btn__delete');
    if (!deleteBtnEl) return;

    const workoutEl = e.target.closest('.workout');

    workoutEl.style.display = 'none';

    const workoutIndex = this.#workouts.findIndex(
      work => work.id === workoutEl.dataset.id
    );

    // Remove the workout marker
    this._removeWorkoutMarker(this.#markers[workoutIndex]);
    this.#markers.splice(workoutIndex, 1);

    // Delete form the list
    this.#workouts.splice(workoutIndex, 1);

    // Update the workouts array
    this._setLocalStorage();
  }

  _editWorkout(e) {
    const editBtnEl = e.target.closest('.btn__edit');
    if (!editBtnEl) return;

    const workoutEl = e.target.closest('.workout');
    console.log(form);
    console.log('Edit button clicked!', workoutEl);

    if (form.classList.contains('hidden')) {
      // Hide workoutEl
      workoutEl.style.display = 'none';
      this._showForm();

      // Rander form with data
      const workoutIndex = this.#workouts.findIndex(
        work => work.id === workoutEl.dataset.id
      );

      const workout = this.#workouts[workoutIndex];
      console.log(workout);

      inputType.value = workout.type;
      inputDistance.value = workout.distance;
      inputDuration.value = workout.duration;
      if (workout.type === 'running') inputCadence.value = workout.cadence;
      if (workout.type === 'cycling') {
        this._toggleElevetionFiled();
        inputElevation.value = workout.elevationGain;
      }

      form.addEventListener('submit', this._newWorkout.bind(this));
    }

    // this._randerForm(workoutEl, this.#workouts[workoutIndex]);

    // Delete form the list
    // this.#workouts.splice(workoutIndex, 1);

    // Update the workouts array
    // this._setLocalStorage();
  }

  _polyline() {
    polyline = L.polyline([], { color: '#00c46a' }).addTo(this.#map);
    let isDrawing = false;

    // Add a click event to the map to create a polyline
    this.#map.on('click', function (e) {
      if (!isDrawing) {
        // Start the polyline at the clicked location
        polyline.setLatLngs([e.latlng]);
        isDrawing = true;
        app.#map.on('mousemove', app._drawLine);
      } else {
        // End the polyline at the clicked location
        polyline.addLatLng(e.latlng);
        isDrawing = false;
        app.#map.off('mousemove', app._drawLine);
      }
    });
  }

  // A function to draw the line as the mouse moves
  _drawLine(e) {
    polyline.addLatLng(e.latlng);
  }

  _sort(e) {
    this._disappearOldWorkouts();
    const type = sortInput.value;

    if (!isSorted || e?.type === 'change') {
      btnSort.classList.add('active');
      this._hideForm();
      if (type === 'distance') this._sortDistance();
      if (type === 'duration') this._sortDuration();
    } else {
      btnSort.classList.remove('active');
      this.#workouts.forEach(work => this._randerWorkout(work));
    }

    isSorted = !isSorted;
  }

  _sortDistance() {
    const duplicateWorkouts = this.#workouts
      .slice()
      .sort((a, b) => a.distance - b.distance);
    duplicateWorkouts.forEach(work => this._randerWorkout(work));
  }

  _sortDuration() {
    const duplicateWorkouts = this.#workouts
      .slice()
      .sort((a, b) => a.duration - b.duration);
    duplicateWorkouts.forEach(work => this._randerWorkout(work));
  }

  _disappearOldWorkouts() {
    allWorkout = document.querySelectorAll('.workout');
    allWorkout.forEach(work => (work.style.display = 'none'));
  }

  _showErrorMessage(text) {
    errorMessage.classList.remove('hidden');
    message.innerHTML = `${text}`;
    setTimeout(() => errorMessage.classList.add('hidden'), 5000);
  }

  _reset() {
    this._disappearOldWorkouts();
    this.#markers.forEach(marker => this._removeWorkoutMarker(marker));
    localStorage.removeItem('workouts');
  }
}

const app = new App();
