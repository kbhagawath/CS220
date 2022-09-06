
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


/*********************Task #1*********************/


/* Function that test an implementation of stable matching. Checks:
*  the offer sequence in the trace is valid, made according to the given algorithm
*  and also checks the produced matching (out) is indeed the result of the offers in the trace.
*/

//runOracle(f: (companies: number[][], candidates: number[][]) => Run): void

function runOracle(f){
  let numTests = 20; 
  for (let i = 0; i < numTests; ++i) {
    let n = 3; 
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let run = f(companies, candidates);
    
    
    function tracing(trace){
      
      let candCurr = [], candComp = [];
      let finalArr = [];
      
      
      function successive(arr, p){
        if(arr[arr.indexOf(p)] === -1){
          return false;
        }
        let x = 0;
        for(let i = 0; i < arr.length; ++i){
          if(arr[i] !== -1){
            break;
          }
          else{
            ++x;
          }
        }
        if(arr.indexOf(p) !== x){
          return false;
        }
        return true;
      }
      
      function algorithm(from, to, c1, c2, trackFrom, trackTo, totArr, fromCo){
        
        function find(to, fromCo){
          for(let i = 0; i < totArr.length; ++i){
            if(fromCo && (totArr[i].candidate === to)){
             return i;
            }
            else if(!fromCo && (totArr[i].company === to)){
              return i;
            }
          }
        }
        
        if(trackFrom.indexOf(from) !== -1){
          if(totArr.length === 0){
            totArr.push({company: -1, candidate: -1});
            return;
          }
          else{
            totArr[0] = {company: -1, candidate: -1};
            return;
          }
        }
        
        else if(successive(c1[from], to) === false){
          if(totArr.length === 0){
            totArr.push({company: -1, candidate: -1});
            return;
          }
          else{
            totArr[0] = {company: -1, candidate: -1};
            return;
          }
        }
        
        else if(trackTo.indexOf(to) === -1){
          trackFrom.push(from);
          trackTo.push(to);
          c1[from][c1[from].indexOf(to)] = -1;
          if(fromCo){
            totArr.push({company: from, candidate: to});
            return;
          }
          else{
            totArr.push({company: to, candidate: from});
            return;
          }
        }
        else{
          let index = find(to, fromCo);
          let currHire = totArr[index];
          let pref = c2[to].indexOf(from);
         
          if(fromCo){
            let currPart = currHire.company;
            let currPref = c2[to].indexOf(currPart);
            if(currPref < pref){
              c1[from][c1[from].indexOf(to)] = -1;
              return;
            }
            else{
              trackFrom.push(from);
              c1[from][c1[from].indexOf(to)] = -1;
              totArr.splice(index, 1);
              if(fromCo){
               let ind = trackFrom.indexOf(currHire.company);
               trackFrom.splice(ind, 1);
              
               totArr.push({company: from, candidate: to});
               return;
              }
              else{
               let ind = trackFrom.indexOf(currHire.candidate);
               trackFrom.splice(ind, 1);
              
               totArr.push({company: to, candidate: from});
               return;
              }
            }
          }
          else{
            let currPart = currHire.candidate;
            let currPref = c2[to].indexOf(currPart);
            if(currPref < pref){
              c1[from][c1[from].indexOf(to)] = -1;
              return;
            }
            else{
              trackFrom.push(from);
              c1[from][c1[from].indexOf(to)] = -1;
              totArr.splice(index, 1);
              if(fromCo){
               let ind = trackFrom.indexOf(currHire.company);
               trackFrom.splice(ind, 1);
              
               totArr.push({company: from, candidate: to});
               return;
              }
              else{
               let ind = trackFrom.indexOf(currHire.candidate);
               trackFrom.splice(ind, 1);
              
               totArr.push({company: to, candidate: from});
               return;
              }
            }
            return;
          } 
        }
      }
      
      for(let i = 0; i < trace.length; ++i){
        let offer = trace[i];
        let from = offer.from;
        let to = offer.to;
        let fromCo = offer.fromCo;
        if(fromCo === true){
          algorithm(from, to, companies, candidates, candComp, candCurr, finalArr, fromCo);
          
          if(finalArr[0].company === -1){
            break;
          }
        }
        else{
          algorithm(from, to, candidates, companies, candCurr, candComp, finalArr, fromCo);
          if(finalArr[0].company === -1){
            break;
          }
        }
      }
      return finalArr;
    }

    let output = tracing(run.trace);

    test('Output is result of matching in trace', function(){
      let bool = false;
      for(let i = 0; i < output.length; ++i){
        let boole = false;
        for(let j = 0; j < run.out.length; ++j){
          if(run.out[j].candidate === output[i].candidate && output[i].company === run.out[j].company){
            boole = true;
          }
        }
        if(!boole){
          break;
        }
        else{
          bool = true;
        }
      }
    });

    test('Output/FinalArr', function(){
      if(output[0].company === -1){
        assert(false);
      }
      assert(true);
    });

    test('Length', function(){
      if(output.length !== run.out.length){
        assert(false);
      }
      else{
        assert(true);
      }
    });
  }
}

const oracleLib = require('oracle');
runOracle(oracleLib.traceWheat1);
runOracle(oracleLib.traceChaff1);
