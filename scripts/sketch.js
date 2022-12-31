let classifier;
let imageModelURL = 'models/tm-my-image-model/model.json';

let video;
let flippedVideo;
let label = "";
let meterHeight = 0;
let drawBackground = false;
let patriotConfirmed = false;

const w = 320;
const h = 240;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL);
}

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.parent("#sketch");
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  if(drawBackground){
    background(0);
  }
  
  // Draw the video
  image(flippedVideo, 0, 0);

  fill(255, 0, 0);
  noStroke();
  rect(width-20, height-meterHeight, 20, meterHeight);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  drawBackground = true;
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  
  /////////////// CLASSIFICATION INFORMATION ////////////////
  // this is the section where you'll initiate a transaction
  // based on the results from the model classification

  if(!patriotConfirmed) {
    if(results[0].label=="over_heart" && results[0].confidence > 0.75) {
      
      meterHeight+=3;
      if(meterHeight >= height) {
        meterHeight = height;
        $("#patriot-confirmed").show();
        let tx = tokenWithSigner.reward(10);
        patriotConfirmed = true;

      }
    } else {
        if(meterHeight > 0) {
          meterHeight-=5;
        }
      }
    }
  
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}
