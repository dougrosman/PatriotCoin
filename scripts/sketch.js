// p5 global variables
let capture;
let cnv;
const w = 640;
const h = 480;

// ml5js global variables
let classifier;
const imageModelURL = '../../models/tm-my-image-model/model.json'

// other global variables
let meterHeight = 0;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL);
}

function setup() {
  cnv = createCanvas(w, h);
  cnv.parent('sketch');
  
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.id('myCapture')
  capture.parent('sketch');

  pixelDensity(1);
  noStroke();
  push()
    rectMode(CENTER);
    rect(width/2, height/2, width, height);
  pop()
  textAlign(CENTER);
  textSize(24);
  text("Please connect to begin evaluation", width/2, height/2);

  // if(startEvaluator) {
  //   console.log("ok")
    
  // }
}

// connectButton.onclick = function() {
//   classifyVideo();
// }

function windowResized() {
  const newWidth = min(640, innerWidth);
  const newHeight = newWidth * 0.75;
  resizeCanvas(newWidth, newHeight);
}

function classifyVideo() {
  classifier.classify(capture, gotResult);
}

async function gotResult(error, results) {
  if (error) {
    console.error(error)
    return;
  }
  clear();

  const GROW_RATE = 10;
  const SHRINK_RATE = 7;
  const METER_WIDTH = width/8;
  
  // if(results[0].label == "over_heart" && results[0].confidence > 0.75 && !mintingPaused) {
  if(true) {
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
  rect(width-METER_WIDTH, height-meterHeight, METER_WIDTH, meterHeight);

  // do the checks

  if(meterHeight >= height && !mintingPaused) {
    patriotConfirmed.style.display = "block";
    mintingPaused = true;
    const time = await contract.getLastMintTime(connectedWallet);
    const nextTime = +time + (24 * 60 * 60)
    if(Date.now()/1000 < nextTime) {
      // alert("Please wait until next available redemption time.")
    } else {
      if(connected) {
        contractWithSigner.GIVEUSACOIN();
      }
    }
    
  }

  classifyVideo();
}