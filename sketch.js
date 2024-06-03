/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/
function preload(){
  carImg = loadImage("car.gif");
  flowerImg = loadImage("flower.gif");
}

let video, bodypose, pose, keypoint, detector;
let poses = [];

// ---------------------------
let eyeOffset = 0; //左到右
let wristOffset = 0; //右到左
const moveSpeed = 2; //移動速度

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);

  //--------------------物件移動
  eyeOffset += moveSpeed;
  if (eyeOffset > width) eyeOffset = -carImg.width;

  wristOffset -= moveSpeed;
  if (wristOffset < -flowerImg.width) wristOffset = width;
}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];

    // shoulder to wrist

    partA = pose.keypoints[0];
    
    //--------------頭上學號姓名
    if(partA.score > 0.1){
      push();
        textSize(50);
        scale(-1,1); //翻轉文字
        translate(-width, 0); //翻轉座標
        text("412730185游子伶", width - partA.x - 200, partA.y - 150);
      pop();
    }

    for (let j = 5; j < 9; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        // line(partA.x, partA.y, partB.x, partB.y);
      }
    }

    // ---------------eyes
    partA = pose.keypoints[1];
    partB = pose.keypoints[2];
    if (partA.score > 0.1 && partB.score > 0.1) {
      // line(partA.x, partA.y, partB.x, partB.y);
      push();
        image(carImg, eyeOffset + partA.x - 20, partA.y - 55, 100, 60); // 由左往右移動
        image(carImg, eyeOffset + partB.x - 60, partB.y - 55, 100, 60); // 由左往右移動
      pop();
    }

    // shoulder to shoulder
    partA = pose.keypoints[5];
    partB = pose.keypoints[6];
    if (partA.score > 0.1 && partB.score > 0.1) {
      // line(partA.x, partA.y, partB.x, partB.y);
    }

    // ----------------wrists
    partA = pose.keypoints[9];
    partB = pose.keypoints[10];
    if (partA.score > 0.1 && partB.score > 0.1) {
      // line(partA.x, partA.y, partB.x, partB.y);
      push();
        image(flowerImg, wristOffset + partA.x - 30, partA.y - 80, 100, 100); // 由右往左移動
        image(flowerImg, wristOffset + partB.x - 50, partB.y - 80, 100, 100); // 由右往左移動
      pop();
    }

    // hip to hip
    partA = pose.keypoints[11];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      // line(partA.x, partA.y, partB.x, partB.y);
    }

    // shoulders to hips(left)
    partA = pose.keypoints[5];
    partB = pose.keypoints[11];
    if (partA.score > 0.1 && partB.score > 0.1) {
      // line(partA.x, partA.y, partB.x, partB.y);
    }

    // shoulders to hips(right)
    partA = pose.keypoints[6];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      // line(partA.x, partA.y, partB.x, partB.y);
    }

    // hip to foot
    for (let j = 11; j < 15; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        // line(partA.x, partA.y, partB.x, partB.y);
      }
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left kneee
  14 right knee
  15 left foot
  16 right foot
*/
