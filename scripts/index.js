var autoCanvas, autoCtx, teleCanvas, teleCtx, field;
const dotSize = 6;
let coords = new Array;

function drawDot(ctx, x, y, size) {
  // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
  r = 255;
  g = 0;
  b = 0;
  a = 50;

  // Select a fill style
  ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";

  // Draw a filled circle
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
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
          drawDot(autoCtx, e.offsetX / 2, e.offsetY / 2, dotSize)
        } else if (e.layerX) {
          drawDot(autoCtx, e.layerX / 2, e.layerY / 2, dotSize)
        }
      }, false)
      teleCanvas.addEventListener('mousedown', e => {
        if (e.offsetX) {
          drawDot(teleCtx, e.offsetX / 2, e.offsetY / 2, dotSize)
        } else if (e.layerX) {
          drawDot(teleCtx, e.layerX / 2, e.layerY / 2, dotSize)
        }
      }, false)
    }
  } else {
    alert('Invalid Canvas');
  }
}

function init() {
  // // set new background
  // $('#background').css({
  //   'background-image': `url('assets/backgrounds/${Math.floor(Math.random() * 3) + 1}.jpg')`,
  //   'background-size': 'cover'
  // })

  initCanvas();
}