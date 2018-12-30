const brushSelect = document.querySelector('select'),
      button      = document.querySelector('a'),
      canvas      = document.querySelector('#draw'),
      colorSelect = document.querySelector('#color-picker'),
      colors      = document.querySelectorAll('#colors span'),
      tools       = document.querySelectorAll('#tools span');

canvas.height = window.innerHeight ;
canvas.width  = window.innerWidth * .9;

const ctx = canvas.getContext('2d');

ctx.fillStyle   = 'white';
ctx.lineCap     = 'round';
ctx.lineWidth   = 1;
ctx.strokeStyle = 'black';

ctx.fillRect(0, 0, canvas.width, canvas.height);

let brushSize    = '10px',
    currentColor = 'black',
    currentTool  = 'pencil',
    isDrawing    = false,
    lastX        = 0,
    lastY        = 0;

const draw = (e) => {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

const download = (e) => {
  const link = canvas.toDataURL('image/png');
  button.download = prompt('Please name your picture:');
  if (button.download === 'null') {

    return e.preventDefault();
  }
  button.href = link;
}

function changeColor() {
  currentColor = this.dataset.color;
  ctx.strokeStyle = currentTool !== 'eraser' ? this.dataset.color : 'white';
  colors.forEach(color => color === this ? color.classList.add('active-color') : color.classList.remove('active-color'));
}

function colorPicker() {
  currentColor = colorSelect.value;
  ctx.strokeStyle = currentTool !== 'eraser' ? colorSelect.value : 'white';
  colors.forEach(color => {
    color.classList.remove('active-color');
  });
}

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

tools.forEach(tool => tool.addEventListener('click', setTool));

colors.forEach(color => {
  color.addEventListener('click', changeColor);
});

colorSelect.addEventListener('change', colorPicker);

brushSelect.addEventListener('click', () => {
  brushSize = brushSelect.value;
  ctx.lineWidth = currentTool === 'pencil' ? 1 : brushSize;
});

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  draw(e);
});

button.addEventListener('click', download);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false); 