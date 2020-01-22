var autoCanvas, autoCtx, teleCanvas, teleCtx, field;
var totalBalls, lowerBalls, outerBalls, innerBalls, coords;
const dotSize = 6;
let autoHistory = new Array;
let teleHistory = new Array;

function drawDot(ctx, x, y, size) {
  // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
  r = 0;
  g = 255;
  b = 255;
  a = 50;

  // Select a fill style
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(a / 255)})`;

  // Draw a filled circle
  ctx.beginPath();
  // for some reason coords are offset by 2 times
  ctx.arc(x / 2, y / 2, size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// phase is either 'tele' or 'auto'
function savePoint(e) {
  let index;
  let phase = e.target.id.substring(0, 4);
  if (phase === 'auto') {
    $('#autoModal').off('hidden.bs.modal');
    index = autoHistory.length - 1;
    coords = autoHistory[index];
  } else {
    $('#teleModal').off('hidden.bs.modal');
    index = teleHistory.length - 1;
    coords = teleHistory[index];
  }
  // save slider values
  totalBalls = $(`#${phase}BallTotal`).val();
  lowerBalls = $(`#${phase}LowerGoal`).val();
  outerBalls = $(`#${phase}OuterGoal`).val();
  innerBalls = $(`#${phase}InnerGoal`).val();
  $(`#${phase}Table`).append(`<tr><td>${coords.x}</td><td>${coords.y}</td><td>${totalBalls}</td><td>${lowerBalls}</td><td>${outerBalls}</td><td>${innerBalls}</td><td class="${phase}Delete" onclick="deleteCanvas(this)" id="${phase}-${index}">&times;</td></tr>`);

  $(`#${phase}Modal`).modal('hide');
}

function deleteCanvas(e) {
  let phase = e.id.substring(0, 4);
  let index = e.id.substring(5);
  console.log(phase, index);
}

function undoCanvas(phase) {
  if (phase === 'auto') {
    autoHistory.pop();
    autoCtx.clearRect(0, 0, 600, 300);
    for (let i of autoHistory) {
      console.log(autoHistory);
      drawDot(autoCtx, i.x, i.y, dotSize);
    }
  } else {
    teleHistory.pop();
    teleCtx.clearRect(0, 0, 600, 300);
    for (let i of teleHistory) {
      console.log(i.x, i.y);
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
  initCanvas();

  $('#submitBtn').on('submit', (e) => {
    e.preventDefault();
  }, false)

  $('#autoSave').click(savePoint);
  $('#teleSave').click(savePoint);
})