const DEBUG = false;
const url = !DEBUG ? "http://73.109.240.48:1983/scouting" : "http://127.0.0.1:1983/scouting";

function requestSchedule(target) {
  $('#getSchedule').attr('class', 'btn btn-warning');
  fetch(`${url}/tba`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'x-stats-tba-redirect-url': `https://www.thebluealliance.com/api/v3/event/${target}/matches/simple`,
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      localStorage.setItem('schedule', JSON.stringify(data.filter(e => e.comp_level === 'qm').sort((a, b) => a.match_number - b.match_number)));
      location.reload();
    })
    .catch((err) => {
      console.warn(err);
      // try and get the custom schedule instead
      fetch(`${url}/schedule`, {
          method: 'GET',
          mode: 'cors',
        })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          localStorage.setItem('schedule', JSON.stringify(data.filter(e => e.comp_level === 'qm').sort((a, b) => a.match_number - b.match_number)));
          location.reload();
        })
        .catch((err) => {
          console.error(err);
          alert('There was a problem retrieving the match schedule.');
        })
    });
}

function showEvent(event) {
  let eventCode = $('#eventCode');
  let eventClass = eventCode.attr('class');
  eventCode.attr('placeholder', event);
  eventCode.attr('class', `${eventClass} is-valid`);
  $('#getSchedule').attr('class', 'btn btn-success');
}

function eventError() {
  let eventCode = $('#eventCode');
  let eventClass = eventCode.attr('class');
  eventCode.attr('class', `${eventClass} is-invalid`);
}

function goToPrematch() {
  let path = location.pathname.split('/');
  path.splice(path.length - 1, 1);
  setTimeout(() => location.href = `${location.protocol}${path.join('/')}/prematch.html`, 300);
}

function saveSettings() {
  let station = $('#station');
  if (station.val() != 'null') {
    localStorage.setItem('station', parseInt(station.val().substring(station.val().length - 1), 10));
    localStorage.setItem('alliance', station.val().substring(0, 3))
    goToPrematch();
  } else {
    station.addClass('is-invalid');
  }
}

function populateMatches() {
  let table = $('#table');
  let items = JSON.parse(localStorage.getItem('matches'));
  for (let i = 0; i < items.length; i++) {
    table.append(`<tr data-index="${i}"><td><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="${i}"></div></td><td>${items[i].event}</td><td>${items[i].match}</td><td>${items[i].team}</td><td onclick="deleteMatch(this, ${i})">&times;</td></tr>`);
  }
}

// return the indicies of selected elements, if any
function getSelected() {

}

// delete a single match
function deleteMatch(e, index) {
  if (confirm('Are you sure you want to delete this match?')) {

  }
}

// delete all selected matches
function deleteSelected() {
  // TODO: first check if any matches are selected
  if (confirm('Are you sure you want to delete all selected matches?')) {

  }
}

// upload selected matches
function uploadSelected() {

}

function uploadCoords() {
  if (localStorage.storedCoords) {
    let coords = JSON.parse(localStorage.getItem('storedCoords'));
    for (let i = 0; i < coords.length; i++) {
      fetch(`${url}/data/shooting`, {
          mode: 'cors',
          method: 'PUT',
          body: JSON.stringify(coords[i]),
          headers: {
            'Content-Type': 'application/json',
            'x-stats-team': coords[i].team
          }
        })
        .then(res => {
          coords.splice(i, 1);
        })
        .catch(err => {
          console.error(err);
        })
    }
    localStorage.setItem('storedCoords', coords);
  } else {
    alert('No saved coordinates!');
  }
}

function init() {
  try {
    const schedule = JSON.parse(localStorage.getItem('schedule'));
    showEvent(schedule[0].event_key);
  } catch {
    console.warn('No event in localStorage!');
    eventError();
  }

  if (localStorage.getItem('station')) {
    $('#station').val(localStorage.getItem('alliance') + localStorage.getItem('station'));
  }
  // populateMatches();

  $('#getSchedule').click(() => {
    requestSchedule($('#eventCode').val());
  })

  $('#continue').click(() => {
    saveSettings();
  })

  $('#coords').click(() => {
    uploadCoords();
  })
}

$(document).ready(init)