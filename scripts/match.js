var autoCanvas, autoCtx, teleCanvas, teleCtx, field;
var totalBalls, lowerBalls, outerBalls, innerBalls, coords;
const dotSize = 12;
var autoShots = new Array;
var teleShots = new Array;
let autoHistory = new Array;
let teleHistory = new Array;

// try {
const match = parseInt(localStorage.getItem('match'), 10);
const station = parseInt(localStorage.getItem('station'));
const schedule = JSON.parse(localStorage.getItem('schedule'))[match - 1];
let alliance = localStorage.getItem('alliance') === 'Red' ? 'red' : 'blue';
const team = parseInt(schedule.alliances[alliance].team_keys[station - 1].substring(3), 10);
// } catch {
//   alert('Error, you do not have a match schedule or settings configured!');
// }

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
      totalBalls,
      lowerBalls,
      outerBalls,
      innerBalls
    });
  } else {
    teleShots.push({
      phase,
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

  $('#submitBtn').click(() => {
    if (confirm('Do you want to submit?')) {
      // Gather all inputs
      let data = {
        team,
        alliance,
        match,
        station,
        event: schedule[0].event_key,
        crossLine: $('#crossLine:checked').length ? true : false,
        deadBot: $('#deadBot:checked').length ? true : false,
        noShow: $('#noShow:checked').length ? true : false,
        rotation: $('#rotation:checked').length ? true : false,
        position: $('#position:checked').length ? true : false,
        park: $('#park:checked').length ? true : false,
        hang: $('#hang:checked').length ? true : false,
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

      // fetch('http://73.109.240.48:1983/scouting/data/match', {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });

      // fetch('http://73.109.240.48:1983/scouting/data/shooting', {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-stats-team': team
      //   }
      // });
    }
  })
});