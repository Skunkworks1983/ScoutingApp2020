const DEBUG = true;
const url = !DEBUG ? "http://73.109.240.48:1983/scouting" : "http://127.0.0.1:1983/scouting";

var autoCanvas, autoCtx, teleCanvas, teleCtx, field;
var totalBalls, lowerBalls, outerBalls, innerBalls, coords;
const dotSize = 12;
var autoShots = [];
var teleShots = [];
let autoHistory = [];
let teleHistory = [];

try {
  match = parseInt(localStorage.getItem('match'), 10);
  station = parseInt(localStorage.getItem('station'));
  scout = localStorage.getItem('scout');
  schedule = JSON.parse(localStorage.getItem('schedule'))[match - 1];
  alliance = localStorage.getItem('alliance') === 'Red' ? 'red' : 'blue';
  team = parseInt(schedule.alliances[alliance].team_keys[station - 1].substring(3), 10);
  week = parseInt(localStorage.getItem('week'));
} catch {
  alert('Error, you do not have a match schedule or settings configured!');
}

function drawDot(ctx, x, y, size) {
  r = 0;
  g = 255;
  b = 255;
  a = 50;

  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(a / 255)})`;

  ctx.beginPath();
  // for some reason coords are offset by 2 
  ctx.arc(x, y, size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function goToPrematch() {
  let path = location.pathname.split('/');
  path.splice(path.length - 1, 1);
  setTimeout(() => location.href = `${location.protocol}${path.join('/')}/prematch.html`, 300);
}

// phase is either 'tele' or 'auto'
function savePoint(e) {
  let index;
  let phase = e.target.id.substring(0, 4);
  // save slider values
  totalBalls = parseInt($(`#${phase}BallTotal`).val());
  lowerBalls = parseInt($(`#${phase}LowerGoal`).val());
  outerBalls = parseInt($(`#${phase}OuterGoal`).val());
  innerBalls = parseInt($(`#${phase}InnerGoal`).val());

  if (totalBalls < (lowerBalls + outerBalls + innerBalls)) {
    return alert('More cells have been scored than shot!');
  }

  if (phase === 'auto') {
    $('#autoModal').off('hidden.bs.modal');
    index = autoHistory.length - 1;
    coords = autoHistory[index];
  } else {
    $('#teleModal').off('hidden.bs.modal');
    index = teleHistory.length - 1;
    coords = teleHistory[index];
  }

  $(`#${phase}Table`).append(`<tr><td>${coords.x}</td><td>${coords.y}</td><td>${totalBalls}</td><td>${lowerBalls}</td><td>${outerBalls}</td><td>${innerBalls}</td><td class="${phase}Delete" onclick="deleteCanvas(this)" id="${phase}-${index}">&times;</td></tr>`);

  $(`#${phase}Modal`).modal('hide');

  if (phase === 'auto') {
    autoShots.push({
      phase,
      week,
      totalBalls,
      lowerBalls,
      outerBalls,
      innerBalls
    });
  } else {
    teleShots.push({
      phase,
      week,
      totalBalls,
      lowerBalls,
      outerBalls,
      innerBalls
    });
  }

  // Set sliders to default
  $(`#${phase}BallTotal`).val(5);
  $(`#${phase}LowerGoal`).val(0);
  $(`#${phase}OuterGoal`).val(0);
  $(`#${phase}InnerGoal`).val(0);
  $(`#${phase}BallTotalReadout`).html(5);
  $(`#${phase}LowerGoalReadout`).html(0);
  $(`#${phase}OuterGoalReadout`).html(0);
  $(`#${phase}InnerGoalReadout`).html(0);
}

function deleteCanvas(e) {
  let phase = e.id.substring(0, 4);
  let index = e.id.substring(5);
  $(e.parentElement).remove();
  if (phase === 'auto') {
    autoHistory[index] = null;
    autoShots[index] = null;
    autoCtx.clearRect(0, 0, 600, 360);
    for (let i of autoHistory.filter(e => e !== null)) {
      drawDot(autoCtx, i.x, i.y, dotSize);
    }
  } else {
    teleHistory[index] = null;
    teleShots[index] = null;
    teleCtx.clearRect(0, 0, 600, 360);
    for (let i of teleHistory.filter(e => e !== null)) {
      drawDot(teleCtx, i.x, i.y, dotSize);
    }
  }
}

function undoCanvas(phase) {
  if (phase === 'auto') {
    autoHistory.pop();
    autoCtx.clearRect(0, 0, 600, 360);
    for (let i of autoHistory.filter(e => e !== null)) {
      drawDot(autoCtx, i.x, i.y, dotSize);
    }
  } else {
    teleHistory.pop();
    teleCtx.clearRect(0, 0, 600, 360);
    for (let i of teleHistory.filter(e => e !== null)) {
      drawDot(teleCtx, i.x, i.y, dotSize);
    }
  }
}

function initCanvas() {
  autoCanvas = document.getElementById('autoCanvas');
  teleCanvas = document.getElementById('teleCanvas');
  if (autoCanvas.getContext) {
    autoCtx = autoCanvas.getContext('2d');
    teleCtx = teleCanvas.getContext('2d');
    if (autoCtx) {
      autoCanvas.addEventListener('mousedown', e => {
        if (e.offsetX) {
          drawDot(autoCtx, e.offsetX, e.offsetY, dotSize);
          $('#autoModal').modal('show');
          autoHistory.push({
            x: e.offsetX,
            y: e.offsetY
          });
          $('#autoModal').off('hidden.bs.modal').on('hidden.bs.modal', () => {
            undoCanvas('auto');
          });
        } else if (e.layerX) {
          drawDot(autoCtx, e.layerX, e.layerY, dotSize);
          $('#autoModal').modal('show');
          autoHistory.push({
            x: e.layerX,
            y: e.layerY
          });
          $('#autoModal').off('hidden.bs.modal').on('hidden.bs.modal', () => {
            undoCanvas('auto');
          });
        }
      }, false)
      teleCanvas.addEventListener('mousedown', e => {
        if (e.offsetX) {
          drawDot(teleCtx, e.offsetX, e.offsetY, dotSize);
          $('#teleModal').modal('show');
          teleHistory.push({
            x: e.layerX,
            y: e.offsetY
          });
          $('#teleModal').off('hidden.bs.modal').on('hidden.bs.modal', () => {
            undoCanvas('tele');
          });
        } else if (e.layerX) {
          drawDot(teleCtx, e.layerX, e.layerY, dotSize);
          $('#teleModal').modal('show');
          teleHistory.push({
            x: e.layerX,
            y: e.layerY
          });
          $('#teleModal').off('hidden.bs.modal').on('hidden.bs.modal', () => {
            undoCanvas('tele');
          });
        }
      }, false)
    }
  } else {
    alert('Invalid Canvas');
  }
}

async function uploadData(e) {
  fetch(`${url}/data/match`, {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(e),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      goToPrematch();
      return true
    })
    .catch(err => {
      console.warn(err);
      if (localStorage.storedMatches) {
        let currentData = JSON.parse(localStorage.getItem('storedMatches'));
        currentData.push(e);
        localStorage.setItem('storedMatches', JSON.stringify(currentData));
      } else {
        localStorage.setItem('storedMatches', JSON.stringify([e]));
      }
      goToPrematch();
      return false
    });
}

async function uploadShots(e) {
  fetch(`${url}/data/shooting`, {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify(e),
      headers: {
        'Content-Type': 'application/json',
        'x-stats-team': team
      }
    })
    .then(res => {
      return true
    })
    .catch(err => {
      console.warn(err);
      let shotArr = e;
      shotArr.team = team;
      if (shotArr.autoHistory.length || shotArr.teleHistory.length) {
        if (localStorage.storedCoords) {
          let currentData = JSON.parse(localStorage.getItem('storedCoords'))
          currentData.push(shotArr);
          localStorage.setItem('storedCoords', JSON.stringify(currentData));
        } else {
          localStorage.setItem('storedCoords', JSON.stringify([shotArr]));
        }
      }
      return false
    });
}

function validateSubmit() {
  let valid = true;
  if ($('#noShow:checked').length && $('*:not(input[type="radio"]):checked').length > 1) {
    valid = false;
    $('#noShow').addClass('is-invalid');
  } else if ($('input[type="radio"]:checked').length < 1) {
    $('#noShow').removeClass('is-invalid').addClass('is-valid');
    valid = false;
    $('input[type="radio"]').addClass('is-invalid');
  }

  if (valid) {
    if (confirm('Do you want to submit?')) {
      // Gather all inputs
      let data = {
        team,
        alliance,
        match,
        station,
        scout,
        event: schedule.event_key,
        crossLine: $('#crossLine:checked').length ? true : false,
        deadBot: $('#deadBot:checked').length ? true : false,
        noShow: $('#noShow:checked').length ? true : false,
        rotation: $('#rotation:checked').length ? true : false,
        position: $('#position:checked').length ? true : false,
        park: $('#park:checked').length ? true : false,
        hang: $('#hang:checked').length ? true : false,
        stuckBall: $('#stuckBall:checked').length ? true : false,
        doubleHang: $('#doubleHang:checked').length ? true : false,
        autoShots: autoShots.filter(e => e !== null),
        teleShots: teleShots.filter(e => e !== null)
      };

      let coordData = {
        autoHistory: autoHistory.filter(e => e !== null),
        teleHistory: teleHistory.filter(e => e !== null),
        autoShots: autoShots.filter(e => e !== null),
        teleShots: teleShots.filter(e => e !== null)
      };
      uploadShots(coordData);
      uploadData(data);
    }
  } else {
    alert('There are errors in the form!');
  }
}

$(document).ready(() => {
  try {
    teamBadge = $('#teamNo');
    teamBadge.html(team);
    if (alliance === 'red') {
      teamBadge.addClass('btn-danger');
    } else if (alliance === 'blue') {
      teamBadge.addClass('btn-info');
    }
  } catch {
    console.warn('Missing config info');
  }
  initCanvas();

  $('#autoSave').click(savePoint);
  $('#teleSave').click(savePoint);

  $('#submitBtn').click(validateSubmit);
})