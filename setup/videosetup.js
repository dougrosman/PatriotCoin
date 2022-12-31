let capture;
let cnv;
const w = 640;
const h = 480;

function setup() {
  cnv = createCanvas(w, h);
  cnv.parent('sketch')

  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.parent('sketch')
}

function draw() {
  stroke(255, 0, 0);
  strokeWeight(3);
  noFill();
  rect(0, 0, width, height);
}