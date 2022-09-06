/*********************Task #1*********************/

/* Function takes an number n as an input
*  and produce a n by x array filling it with
*  random values and returns the array.
*/

//generateInput(n: number): number[][]

function generateInput(n){
  let arr = [];

  // Returns a random int i where min <= i < max
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  for (let i = 0; i <= n-1; ++i){
    arr.push([]);
    while( arr[i].length < n){
      let rint = randomInt(0, n);
      if ( arr[i].includes(rint) === false ){
        arr[i].push(rint);
      }
    }
  }
  console.log(arr);
  return arr;
}

generateInput(3);



/*********************Task #2*********************/

/* Function that test an implementation of stable matching.
*  Will be ccalled with a function that generates
*  a matching from the given preference arrays.
*/

//oracle(f: (companies: number[][], candidates: number[][]) => Hire[]): void

function oracle(f) {
  let numTests = 20; 
  for (let i = 0; i < numTests; ++i) {
    let n = 6; 
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
      assert(candidates.length === hires.length);
    });

    test("Stability", function(){
      let stability = true;
      for(let x = 0; x < hires.length; ++x){  
        for(let y = 0; y < companies.length; ++y){          
          let company1 = hires[x].company, company2 = y;     
          let candidate1 = hires[x].candidate, candidate2 = -1;      

            for(let z = 0; z < hires.length; ++z){       
              if(hires[z].company === company2){
                candidate2 = hires[z].candidate;
              }
            }

          let compPref = companies[company1];  
          let candPref = candidates[candidate2];

        if (compPref.indexOf(candidate1) > compPref.indexOf(candidate2) && candPref.indexOf(company2) > candPref.indexOf(company1)
        ){
          stability = false;
        }
      }
    }
    assert(stability);
    });
  }

  numTests = 200; 
  for (let i = 0; i < numTests; ++i) {
    let n = 3; 
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
      assert(candidates.length === hires.length);
    });

    test("Stability", function(){
      let stability = true;
      for(let x = 0; x < hires.length; ++x){  
        for(let y = 0; y < companies.length; ++y){          
          let company1 = hires[x].company, company2 = y;     
          let candidate1 = hires[x].candidate, candidate2 = -1;      

            for(let z = 0; z < hires.length; ++z){       
              if(hires[z].company === company2){
                candidate2 = hires[z].candidate;
              }
            }

          let compPref = companies[company1];  
          let candPref = candidates[candidate2];

        if (compPref.indexOf(candidate1) > compPref.indexOf(candidate2) && candPref.indexOf(company2) > candPref.indexOf(company1)
        ){
          stability = false;
        }
      }
    }
    assert(stability);
    });
  }
}




/*********************TESTS*********************/

test('Check randomInput', function(){
  let input = 5;
  let arr = generateInput(input);
  assert(arr.length === input);
  
  for (let i = 0; i < input; ++i){
    assert(arr[i].length === input);
    assert(arr[i].includes(i))
  }
});


oracle(wheat1);
oracle(chaff1);