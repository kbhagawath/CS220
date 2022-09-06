let url =
'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);

/*********************Task #1*********************/

/* Function takes an Image and a Function as an input and
*  applies each pixel of the image to a function  
*  and return an image.
*/

// imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image

function imageMapXY(robot, func){
  let robo = robot.copy();
  for (let i = 0; i < robo.width; ++i){
    for (let j = 0; j < robo.height; ++j){
      let pix = func(robo,i,j);
      robo.setPixel(i,j,pix);
    }
  }
  return robo;
}

imageMapXY(robot, function(img, x, y) {
return [img.getPixel(x, y)[0], 0, 0];
}).show();


/*********************Task #2*********************/

/* Function takes an image, a Function and a Pixel as an input and
*  applies each pixel of the image to the function  
*  and return an image.
*/

//imageMask(img: Image, cond: (img: Image, x: number, y: number) => boolean,maskValue: Pixel): Image

function imageMask(img, cond, maskValue){
  let imgCopy = img.copy();
  
  function imageMaskHelper(imgCopy, w, h){
    if (cond(imgCopy, w, h)){
      return maskValue;
    } else {
      return imgCopy.getPixel(w, h)
    }
  }
  let robo = imageMapXY(imgCopy, imageMaskHelper);
  return robo;
}

imageMask(robot, function(img,x,y){ return (y % 10 === 0); }, [1, 0, 0]).show();



/*********************Task #3*********************/

/* Function takes an Image, a Function and another Function as an input 
*  and applies each pixel of the image to a function  
*  and return an image.
*/

//imageMapCond(img: Image, cond: (img: Image, x: number, y: number) => boolean, func: (p: Pixel) => Pixel): Image

function imageMapCond(img, cond, func){
  let imgCopy = img.copy();
  
  function imageMaskCondHelper(imgCopy, w, h){
    if (cond(imgCopy, w, h)){
      return func(imgCopy.getPixel(w,h));
    } else {
      return imgCopy.getPixel(w, h)
    }
  }
  let robo = imageMapXY(imgCopy, imageMaskCondHelper);
  return robo;
}


/*********************Task #4*********************/

/* Function takes an Pixel as an input 
*  and checks if the difference between the
*  maximum and minimum color channel value   
*  is at most 1/3 and returns a boolean value.
*/

//isGrayish(p: Pixel): boolean

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


/*********************Task #5*********************/

/* Function takes an image as an input 
*  and runs the isGrayish function on each pixel   
*  and returns a modified image.
*/

//makeGrayish(img: Image): Image

function makeGrayish(img){
  let imgCopy = img.copy();
  
  function makeGrayishHelper(imgCopy, w, h){
    let pixel = imgCopy.getPixel(w, h);
    if (isGrayish(pixel)){
      return pixel;
    } else {
      return [ (pixel[0] + pixel[1] + pixel[2])/3, (pixel[0] + pixel[1] + pixel[2])/3, (pixel[0] + pixel[1] + pixel[2])/3 ];
    }
  }
  let robo = imageMapXY(imgCopy, makeGrayishHelper);
  return robo;
}
makeGrayish(robot).show();


/*********************Task #6*********************/

/* Function takes an Pixel as an input 
*  and runs makeGrayish on the top half
*  of the image while bottom half is in color 
*  and returns the modified image.
*/

//grayHalfImage(img: Image): Image

function grayHalfImage(img){
  let imgCopy = img.copy();

  function grayHalfImageHelper(imgCopy, w, h){
    let pixel = imgCopy.getPixel(w, h);
    let height = imgCopy.height;
    if (h < height/2){
      if (isGrayish(pixel)){
        return pixel;
      } else {
        return [ (pixel[0] + pixel[1] + pixel[2])/3, (pixel[0] + pixel[1] + pixel[2])/3, (pixel[0] + pixel[1] + pixel[2])/3 ];
      }
    } else {
      return pixel;
    }
  }
  let robo = imageMapXY(imgCopy, grayHalfImageHelper);
  return robo;
}
grayHalfImage(robot).show();



/*********************Task #7*********************/

/* Function takes an Pixel as an input 
*  and changes the channel value to 0 if the 
*  initial channel value is less than 1/3 
*  and returns the modified image.
*/

//blackenLow(img: Image): Image

function blackenLow(img){

  let imgCopy = img.copy();
  
  function blackenLowHelper(imgCopy, w, h){
    let pixel = imgCopy.getPixel(w, h);
    return pixel.map(x => (x < 1/3) ? 0 : x);
  }
  let robo = imageMapXY(imgCopy, blackenLowHelper);
  return robo;

}
blackenLow(robot).show();



/*********************TESTS*********************/

 
test('imageMapXY function definition is correct', function() {
function identity(image, x, y) { return image.getPixel(x, y); }
let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
let outputImage = imageMapXY(inputImage, identity);
let p = outputImage.getPixel(0, 0); // output should be an image, getPixel works
assert(p.every(c => c === 0)); // every pixel channel is 0
assert(inputImage !== outputImage); // output should be a different image object
});

function pixelEq (p1, p2) {
const epsilon = 0.002; // increase for repeated storing & rounding
return [0,1,2].every(i => Math.abs(p1[i] - p2[i]) <= epsilon);
};
test('identity function with imageMapXY', function() {
let identityFunction = function(image, x, y ) {
return image.getPixel(x, y);
};
let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
let outputImage = imageMapXY(inputImage, identityFunction);
assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});