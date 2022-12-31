let capture;
let cnv;
const w = 640;
const h = 480;
let meterHeight = 0;

const GROW_RATE = 2;
const SHRINK_RATE = 7;

function setup() {
  cnv = createCanvas(w, h);
  cnv.parent('sketch');
  
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.parent('sketch');

  pixelDensity(1);
  noStroke();
}

function draw() {
  clear();
  const meterWidth = width/8;

  if(mouseX > width/2) {
    if(meterHeight < height) {
      meterHeight+=GROW_RATE;
    }
  } else {
    if(meterHeight > 0) {
      meterHeight-=SHRINK_RATE;
    }
  }
  
  const startColor = color(255, 0, 0);
  const endColor = color(0, 0, 255);
  const lerpAmount = map(meterHeight, 0, height, 0, 1);
  const lerpedColor = lerpColor(startColor, endColor, lerpAmount);

  fill(lerpedColor);
  rect(width-meterWidth, height-meterHeight, meterWidth, meterHeight);
}

function windowResized() {
  const newWidth = min(640, innerWidth);
  const newHeight = newWidth * 0.75;
  resizeCanvas(newWidth, newHeight);
}