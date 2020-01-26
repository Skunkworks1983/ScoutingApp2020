const DEBUG = true;
const url = !DEBUG ? "http://73.109.240.48:1983/scouting" : "http://127.0.0.1:1983/scouting";

function requestSchedule(target) {
  $('#getSchedule').attr('class', 'btn btn-warning');
  if (localStorage.schedule) {
    localStorage.removeItem('schedule');
  }
  fetch(`${url}/tba`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'x-stats-tba-redirect-url': `https://www.thebluealliance.com/api/v3/event/${target}/matches/simple`,
      }
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      localStorage.setItem('schedule', JSON.stringify(data.filter(e => e.comp_level === 'qm').sort((a, b) => a.match_number - b.match_number)));
      location.reload();
    })
    .catch(err => {
      console.warn(err);
      // try and get the custom schedule instead
      fetch(`${url}/schedule`, {
          method: 'GET',
          mode: 'cors',
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          localStorage.setItem('schedule', JSON.stringify(data.filter(e => e.comp_level === 'qm').sort((a, b) => a.match_number - b.match_number)));
          location.reload();
        })
        .catch(err => {
          console.error(err);
          $('#getSchedule').attr('class', 'btn btn-danger');
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
  if (localStorage.storedMatches) {
    let table = $('#table');
    let items = JSON.parse(localStorage.getItem('storedMatches'));
    for (let i = 0; i < items.length; i++) {
      table.append(`<tr data-index="${i}"><td class="custom-control custom-switch" style="float: right"><input type="checkbox" class="custom-control-input" id="${i}"><label class="custom-control-label" for="${i}"></label></td><td>${items[i].event}</td><td>${items[i].match}</td><td>${items[i].team}</td><td onclick="deleteMatch(this, ${i})">&times;</td></tr>`);
    }
  }
}

function selectAll() {
  $('input[type="checkbox"]').prop('checked', true);
  $('#selectAll').off().html('Deselect All').click(deselectAll);
}

function deselectAll() {
  $('input[type="checkbox"]').prop('checked', false);
  $('#selectAll').off().html('Select All').click(selectAll);
}

// delete a single match
function deleteMatch(e, index) {
  if (confirm('Are you sure you want to delete this match?')) {
    let matches = JSON.parse(localStorage.getItem('storedMatches'));
    matches.splice(index, 1);
    localStorage.setItem('storedMatches', JSON.stringify(matches));
    $(e).parent('tr').remove();
  }
}

// delete all selected matches
function deleteSelected() {
  // TODO: first check if any matches are selected
  if (confirm('Are you sure you want to delete all selected matches?')) {
    let containers = $('input[type="checkbox"]:checked').parents('tr');
    let matches = JSON.parse(localStorage.getItem('storedMatches'));
    for (let i of containers) {
      let index = $(i).attr('data-index');
      matches.splice(index, 1);
      $(i).remove();
    }
    localStorage.setItem('storedMatches', JSON.stringify(matches));
  }
}

// upload selected matches
function uploadSelected() {
  let containers = $('input[type="checkbox"]:checked').parents('tr');
  let matches = JSON.parse(localStorage.getItem('storedMatches'));
  for (let i = containers.length - 1; i >= 0; i--) {
    let index = $(containers[i]).attr('data-index');
    fetch(`${url}/data/match`, {
        mode: 'cors',
        method: 'PUT',
        body: JSON.stringify(matches[index]),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        matches[index] = null;
        $(containers[i]).remove();
        localStorage.setItem('storedMatches', JSON.stringify(matches.filter(e => e !== null)));
      })
      .catch(err => {
        console.warn(err);
        $('#upload').attr('class', 'btn btn-danger');
        $(`input[id="${index}"]`).addClass('is-invalid');
      })
  }
}

function uploadCoords() {
  if (localStorage.storedCoords) {
    let coords = JSON.parse(localStorage.getItem('storedCoords'));
    for (let i = coords.length - 1; i >= 0; i--) {
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
          console.log(coords);
          localStorage.setItem('storedCoords', JSON.stringify(coords));
        })
        .catch(err => {
          console.error(err);
          $('#coords').attr('class', 'btn btn-danger');
        })
    }
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
  populateMatches();

  $('#getSchedule').click(() => {
    requestSchedule($('#eventCode').val());
  })

  $('#selectAll').click(() => {
    selectAll();
  })

  $('#upload').click(() => {
    uploadSelected();
  })

  $('#delete').click(() => {
    deleteSelected();
  })

  $('#continue').click(() => {
    saveSettings();
  })

  $('#coords').click(() => {
    uploadCoords();
  })
}

$(document).ready(init)