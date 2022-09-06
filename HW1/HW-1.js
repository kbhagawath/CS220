let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');

/*********************Tash #1*********************/
/*
* Function takes an image as an input and
* removes blue and green pixels from the image
* and return an image.
*/
//removeBlueAndGreen(robot : Image) : Image

function removeBlueAndGreen(robot){
  let robo = robot.copy();
  for (let i = 0; i < robo.width; ++i) {
    for (let j = 0; j < robo.height; ++j) {
      let r = robo.getPixel(i, j)[0];
      robo.setPixel(i, j, [r, 0.0, 0.0]);
    }
  }
  return robo;
}
removeBlueAndGreen(robot).show();;


/*********************Tash #2*********************/
/*
* Function takes an image as an input and
* shifts the color of a pixel un the input image from 
* red, blue and green pixels to gree, blue and red 
* and return an image.
*/

// shiftRGB(robot : Image) : Image

function shiftRGB(robot){
  let robo = robot.copy();
  for (let i = 0; i < robo.width; ++i) {
    for (let j = 0; j < robo.height; ++j) {
      let r = robo.getPixel(i, j)[0];
      let g = robo.getPixel(i, j)[1];
      let b = robo.getPixel(i, j)[2];
      robo.setPixel(i, j, [g, b, r]);
    }
  }
  return robo;
}

shiftRGB(robot).show();


/*********************Tash #3*********************/
/*
* Function takes an image as an input and
* applies each pixel of the image to a function  
* and return an image.
*/

// imageMap(img: Image, func: (p: Pixel) => Pixel): Image

function imageMap(image, func){
  let img = image.copy();
  for (let i = 0; i < img.width; ++i){
    for (let j = 0; j < img.height; ++j){
      let pix = func(img.getPixel(i, j));
      img.setPixel(i,j,pix);
    }
  }
  img.show();
  return img;
}

imageMap(robot, p=> p).show();


/*********************Tash #4*********************/
/*
* Functions which uses imageMap to behave exactly like  
* removeBlueAndGreen and shiftRGB
*/

// mapToRedHelper(rgb : T[]) : T[]

function mapToRedHelper(rgb){
  return [rgb[0], 0.0, 0.0];
}


// mapToRed(robot: Image) : Image
function mapToRed(robot){
  return imageMap(robot, mapToRedHelper);
}
mapToRed(robot);

// mapToGBRHelper(rgb : T[]) : T[]
function mapToGBRHelper(rgb){
  return [rgb[1], rgb[2], rgb[0]];
}

// mapToGBR(robot: Image) : Image
function mapToGBR(robot){
  return imageMap(robot, mapToGBRHelper);
}
mapToGBR(robot);


/*********************Tash #5*********************/
/*
* Function takes an image as an input where
* each pixel of the image is shifted by 10% to 
* the closest of the two limits 0 and 1 
* and return an image.
*/

// increaseContrastHelper(rgb: T[]): T[]

function increaseContrastHelper(rgb){
  return [helper(rgb[0]), helper(rgb[1]), helper(rgb[2]) ];
}

// helper(pix: number) : number

function helper(pix){
  if (pix === 0.5){
    return 0.5;
  }
  else if (pix < 0.5){
    return (pix - (pix)*0.1);
  }
  else{
    return (pix + (1-pix)*0.1);
  }
}

// increseContrast(robot : Image) : Image

function increaseContrast(robot){
  return imageMap(robot, increaseContrastHelper);
}
increaseContrast(robot);



/*********************TESTS*********************/

test('removeBlueAndGreen function definition is correct', function() {
const white = lib220.createImage(10, 10, [1,1,1]);
removeBlueAndGreen(white).getPixel(0,0);
// Checks that code runs. Need to use assert to check properties.
});

test('No blue or green in removeBlueAndGreen result', function() {
// Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
const white = lib220.createImage(10, 10, [1,1,1]);
// Get the result of the function.
const shouldBeRed = removeBlueAndGreen(white);
// Read the center pixel.
const pixelValue = shouldBeRed.getPixel(5, 5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
// The green channel should be 0.
assert(pixelValue[1] === 0);
// The blue channel should be 0.
assert(pixelValue[2] === 0);
});

function pixelEq (p1, p2) {
const epsilon = 0.002;
for (let i = 0; i < 3; ++i) {
if (Math.abs(p1[i] - p2[i]) > epsilon) {
return false;
}
}
return true;
};
4
test('Check pixel equality', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = removeBlueAndGreen(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0.5, 0, 0]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0.5, 0, 0]));
});