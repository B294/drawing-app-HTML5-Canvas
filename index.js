const brushSelect = document.querySelector('select'),
      canvas      = document.querySelector('#draw'),
      colorSelect = document.querySelector('#color-picker'),
      colors      = document.querySelectorAll('#colors span'),
      resetButton = document.querySelector('#reset'),
      saveButton  = document.querySelector('a'),
      tools       = document.querySelectorAll('#tools span');

canvas.height = window.innerHeight ;
canvas.width  = window.innerWidth * .9;  //90% canvas width, 10% toolbar width

const ctx = canvas.getContext('2d');

ctx.fillStyle   = 'white';
ctx.lineCap     = 'round';
ctx.lineWidth   = 1;
ctx.strokeStyle = 'black';

ctx.fillRect(0, 0, canvas.width, canvas.height);

const startingCanvas = canvas.toDataURL();

let brushSize    = '10px',
    currentColor = 'black',
    currentTool  = 'pencil',
    isDrawing    = false,
    lastX        = 0,
    lastY        = 0,
    rect         = '';

const continuousDraw = (e) => {
  e.preventDefault();
  if (!isDrawing) return;
   
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  e.touches ? ctx.lineTo(e.touches[0].pageX - rect.left, e.touches[0].pageY - rect.top) : ctx.lineTo(e.offsetX, e.offsetY);
  [lastX, lastY] = e.touches ? [e.touches[0].pageX - rect.left, e.touches[0].pageY - rect.top] : [e.offsetX, e.offsetY];
  ctx.stroke();
}

const startDraw = (e) => {
  e.preventDefault();
  rect = e.target.getBoundingClientRect();
  isDrawing = true;
  [lastX, lastY] = e.touches ? [e.touches[0].pageX - rect.left, e.touches[0].pageY - rect.top] : [e.offsetX, e.offsetY];
  draw(e);
}

  //normal functions used here to preverse "this" from event listeners
function changeColor() {
  currentColor = this.dataset.color;
  ctx.strokeStyle = currentTool !== 'eraser' ? this.dataset.color : 'white';
  colors.forEach(color => color === this ? color.classList.add('active-color') : color.classList.remove('active-color'));
}

function colorPicker() {
  currentColor = this.value;
  ctx.strokeStyle = currentTool !== 'eraser' ? this.value : 'white';
  colors.forEach(color => color.classList.remove('active-color'));
}

  //currently everything is setup to work with 3 tool types.  If more tools are added, the conditionals will have to be reworked
function setTool() {
  if (this.dataset.name === 'pencil') {
    ctx.lineWidth = 1;
    currentTool = 'pencil';
  } else {
    ctx.lineWidth = brushSize > 1 ? brushSize : 10;
    currentTool = this.dataset.name === 'eraser' ? 'eraser' : 'brush';
  }
  tools.forEach(tool => tool === this ? tool.classList.add('active-tool') : tool.classList.remove('active-tool'));
  ctx.lineCap = this.dataset.name === 'eraser' ? 'square' : 'round';
  ctx.strokeStyle = this.dataset.name === 'eraser' ? 'white' : currentColor;
}

function downloadImage(e) {
  if (startingCanvas === canvas.toDataURL()) return e.preventDefault();

  this.download = prompt('Please name your picture:');
  if (this.download === 'null') return e.preventDefault();

  this.href = canvas.toDataURL('image/png');
}

function reset() {
  if (startingCanvas === canvas.toDataURL()) return;

  if (!confirm('Are you sure you want to delete all of your work?')) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

  //toolbar event listeners
brushSelect.addEventListener('click', () => {
  brushSize = brushSelect.value;
  ctx.lineWidth = currentTool === 'pencil' ? 1 : brushSize;
});
colorSelect.addEventListener('change', colorPicker);
saveButton.addEventListener('click', downloadImage);
resetButton.addEventListener('click', reset);

tools.forEach(tool => tool.addEventListener('click', setTool));
colors.forEach(color => color.addEventListener('click', changeColor));

  // canvas event listeners
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', continuousDraw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', continuousDraw);
canvas.addEventListener('touchend', () => isDrawing = false);