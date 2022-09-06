let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

/*********************Task #1*********************/

/* Function takes an Image and two numbers x and y as an input and
*  blurs the pixel present at the (x, y) by taking
*  the average of all the channel values of pixel surrounding
*  the main pixel by a difference of 1 
*  and return an pixel.
*/

//blurPixel(img: Image, x: number, y: number): Pixel

function blurPixel(img, x, y){
  let sumR = 0, sumB = 0, sumG = 0, count = 0;

  for(let i = x-1; i <= x+1; ++i){
    if ( i >= 0 && i < img.width ){
      for (let j = y-1; j <= y+1; ++j){
        if ( j >= 0 && j < img.height ){
          sumR += img.getPixel(i, j)[0];
          sumG += img.getPixel(i, j)[1];
          sumB += img.getPixel(i, j)[2];
          ++count;
        }
      }
    }
  }
 return [sumR/count,sumG/count,sumB/count];
}


function imageMap(robot, func){
  let robo = robot.copy();
  for (let i = 0; i < robot.width; ++i){
    for (let j = 0; j < robot.height; ++j){
      let pix = func(robot,i,j);
      robo.setPixel(i,j,pix);
    }
  }
  return robo;
}

/*********************Task #2*********************/

/* Function takes an Image as an input and
*  blurs the image by calling the blurPixel
*  function on the whole image
*  and returns the modified Image.
*/

//blurImage(img: Image): Image

function blurImage(robot){
  let imgCopy = robot.copy();
  let robo = imageMap(imgCopy, blurPixel);
  return robo;
}

blurImage(robot).show();


/*********************Task #3*********************/

/* Function takes an Image and two numbers x and y as an input and
*  returns [0, 0, 0] if (x-1, y) doesn't exist else returns 
*  the absolute value of the difference between the 
*  the average of the channels of pixel at (x,y) and 
*  the average of the channels of pixel at (x-1, y) 
*  in the form of a pixel.
*/

//diffLeft(img: Image, x: number, y: number): Pixel

function diffLeft(robot, x, y){
  let m1 =  ( robot.getPixel(x, y)[0] + robot.getPixel(x, y)[1] + robot.getPixel(x, y)[2] ) / 3;
  if ( x-1 < 0 ){
    return [0, 0, 0];
  }
  else {
    let m2 = ( robot.getPixel(x-1, y)[0] + robot.getPixel(x-1, y)[1] + robot.getPixel(x-1, y)[2] ) / 3;
    let res = Math.abs(m2 - m1);
    return [res, res, res];
  }
}

/*********************Task #4*********************/

/* Function takes an Image as an input and
*  returns the grayscaled version of the image
*  with the highlighted edges by calling the 
*  diffLefft function on the whole image.
*/

//highlightEdges(img: Image): Image

function highlightEdges(robot){
  let imgCopy = robot.copy();
  let robo = imageMap(imgCopy, diffLeft);
  return robo;  
}

highlightEdges(robot).show();


/*********************Task #5*********************/

/* Function takes an array of functions as Input with
*  each function takes pixel as an input and returning a pixel.
*  The function returns a single function pixel => pixel that 
*  composes all functions in the array with the function at index 0 
*  being applied to the pixel first.
*/

//reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)

function reduceFunctions(fa){
  let res = i => fa.reduce((x, element) => element(x) , i );
  return res;
}


function isGrayish(pixel){
  let r = pixel[0];
  let g = pixel[1];
  let b = pixel[2];

  let min = r;
  min = (g < min) ? g : min;
  min = (b < min) ? b : min;

  let max = r;
  max = (g > max) ? g : max;
  max = (b > max) ? b : max;

  return ((max - min <= 1/3) ? true : false); 
    
}


function makeGrayish(pixel){
  if (isGrayish(pixel)){
    return pixel;
  } else {
    return [ (pixel[0] + pixel[1] + pixel[2])/3, (pixel[0] + pixel[1] + pixel[2])/3, (pixel[0] + pixel[1] + pixel[2])/3 ];
  }
}


function blackenLow(pixel){
  return pixel.map(x => (x < 1/3) ? 0 : x);
}


function shiftRGB(pixel){
  let r = pixel[0];
  let g = pixel[1];
  let b = pixel[2];
  return [g, b, r];
}

/*********************Task #6*********************/

/* Function takes an image as an Input
*  where each pixel of the image is transformed 
*  successively by calling reduceFunctions on 
*  the whole image and returns the modified image.
*/

//combineThree(img: Image): Image

function combineThree(robot){
  let robo = robot.copy();
  return imageMap(robo, function (robo, i, j) {
    return reduceFunctions([makeGrayish, blackenLow, shiftRGB])(robo.getPixel(i, j));
  });
}
combineThree(robot).show();


/*********************TESTS*********************/

function pixelEq (p1, p2) {
const epsilon = 0.002; // increase for repeated storing & rounding
return [0,1,2].every(i => Math.abs(p1[i] - p2[i]) <= epsilon);
};

test('Check blurPixel', function() {
  let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
  inputImage.setPixel(0, 0, [1, 1, 1]);
  inputImage.setPixel(0, 1, [.5, .5, .5]);
  inputImage.setPixel(1, 0, [.7, .7, .7]);
  inputImage.setPixel(1, 1, [.6, .6, .6]);
  let pix = blurPixel(inputImage, 0, 0);
  assert(pixelEq(pix, [.7, .7, .7]));
});

test('Check blurImage', function() {
  const inputPixel = [0.5, 0.5, 0.5]
  const image = lib220.createImage(10, 10, inputPixel);
  image.setPixel(0, 0, [1, 1, 1]);
  image.setPixel(0, 1, [.5, .5, .5]);
  image.setPixel(1, 0, [.7, .7, .7]);
  image.setPixel(1, 1, [1, 1, 1]);
  const outputImage = blurImage(image);
  const centerPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(centerPixel, [.8, .8, .8]));
});

test('Check diffLeft', function() {
  const inputPixel = [0.5, 0.5, 0.5]
  const image = lib220.createImage(10, 10, inputPixel);
  image.setPixel(0, 0, [1, 1, 1]);
  const output = diffLeft(image, 0, 0);
  assert(pixelEq(output, [0, 0, 0]));

  image.setPixel(5, 5, [1, 1, 1]);
  image.setPixel(4, 5, [.3, .3, .3]);
  const output1 = diffLeft(image, 5, 5);
  assert(pixelEq(output1, [.7, .7, .7]));  
});


test('Check highlightEdges', function() {
  const inputPixel = [0.5, 0.5, 0.5]
  const image = lib220.createImage(10, 10, inputPixel);
  image.setPixel(0, 0, [1, 1, 1]);
  const outputImage = highlightEdges(image);
  const output = outputImage.getPixel(0,0);
  assert(pixelEq(output, [0, 0, 0]));

  image.setPixel(5, 5, [1, 1, 1]);
  image.setPixel(4, 5, [.8, .8, .8]);
  const outputImage1 = highlightEdges(image);
  const output1 = outputImage1.getPixel(5,5);
  assert(pixelEq(output1, [.2, .2, .2]));  
});

test('check reduceFunctions', function() {
  let arr = [
  (x) => {let a = [0, 0, 0]; a[0] = x[1]; a[1] = x[2]; a[2] = x[0]; return a;}, 
  (y) => {let b = [0, 0, 0]; b[0] = y[0]*10; b[1] = y[1] / 10; b[2] = y[2]*10; return b;}, 
  (z) => {let c = [0, 0, 0]; c[0] = z[0] * z[0]; c[1] = z[1] + z[1]; c[2] = z[2] / z[2]; return c;}
  ];
  let func = reduceFunctions(arr);
  let pix = [.5, 2, 20];
  let pixel = func(pix);
  assert(pixelEq(pixel, [400, 4, 1]));
});


test('Check combineThree', function() {
  let inputImage = lib220.createImage(10, 10, [0.5, 0.2, 0.8]);
  inputImage.setPixel(0, 0, [1, 1, 1]);
  inputImage.setPixel(0, 1, [.5, .5, .5]);
  inputImage.setPixel(1, 0, [.1, .2, .3]);
  inputImage.setPixel(9, 9, [.3, .3, .9]);
  inputImage.setPixel(7, 2, [.1, .3, .2]);

  const outputImage = combineThree(inputImage);
  assert(pixelEq(outputImage.getPixel(0, 0), [1, 1, 1]));
  assert(pixelEq(outputImage.getPixel(0, 1), [.5, .5, .5]));
  assert(pixelEq(outputImage.getPixel(1, 0), [0, 0, 0]));
  assert(pixelEq(outputImage.getPixel(5, 5), [.5, .5, .5]));
  
  const outputImage1 = combineThree(inputImage);
  assert(pixelEq( outputImage1.getPixel(9,9), [.5, .5, .5]));

  const outputImage3 = combineThree(inputImage);
  assert(pixelEq(outputImage3.getPixel(7,2), [0, 0, 0]));
});
