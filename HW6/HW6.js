// memo0<T>(f: () => T): Memo<T>
function memo0(f) {
    let r = { evaluated: false };
    return {
        get() {
          if (! r.evaluated) { r = { evaluated: true, v: f() } }
          return r.v;
        }
    };
}
// sempty: Stream<T>
const sempty = {
    isEmpty: () => true,
    toString: () => 'sempty',    
    map: f => sempty,
    filter: pred => sempty,
};
// snode<T>(head: T, tail: Memo<Stream<T>>): Stream<T>
function snode(head, tail) {
    return {
        isEmpty: () => false,
        head: () => head,
        tail: tail.get,
        toString: () => "snode(" + head.toString() + ", " + tail.toString() + ")",
        map: f => snode(f(head), memo0(() => tail.get().map(f))),
        filter: pred => pred(head) ?
                  snode(head, memo0(() => tail.get().filter(pred)))
                : tail.get().filter(pred),
    }
}

/*********************Task #1*********************/
/* Function takes two streams of coefficients for the  
*  series s(x) and t(x) and returns the stream
*  of coefficients for the sum s(x) + t(x)
*/

//addSeries(s: Stream<T>, t: Stream<T>): Stream<T>
function addSeries(s, t){
  if (s.isEmpty()) { return t;}
  if (t.isEmpty()) { return s;}
  let h1 = s.head();
  let h2 = t.head();
  return snode( h1 + h2, memo0(() => addSeries(s.tail(), t.tail())) );
}


/*********************Task #2*********************/
/* Function takes two streams of coefficients for the  
*  series s(x) and t(x) and returns the stream
*  of coefficients for the product s(x) * t(x)
*/

//prodSeries(s: Stream<T>, t: Stream<T>): Stream<T>
function prodSeries(s, t){
  if (s.isEmpty()) { return s; }
  let curr = t.map(x => x * s.head());
  return snode(curr.head(), memo0(() => addSeries(curr.tail(), prodSeries(s.tail(), t))));
}


/*********************Task #3*********************/
/* Function takes a streams of coefficients for the  
*  series s(x) and returns the stream
*  of coefficients for the derivative s'(x)
*/

//derivSeries(s: Stream<T>): Stream<T>
function derivSeries(s){
  let a = 1;
  function helper(a, s){
    if (s.isEmpty()) {return s;}
    let h = s.head();
    return snode( h * a, memo0(() => helper(a+=1, s.tail()))); 
  }
  return helper(a, s.tail());
}


/*********************Task #4*********************/
/* Function takes a streams of coefficients and a natural numbern   
*  and returns the array of coefficients of s(x) upto and including that of 
*  order n. If the stream has fewer coefficients, it returns as many as there are.
*/

//coeff(s: Stream<T>, n: number): Array[]
function coeff(s, n){
  let arr = [];
  function helper(s, n, arr){
    if ( n === -1 ) {return arr;}
    if ( s.isEmpty()) {return arr;}

    arr.push(s.head());
    return helper(s.tail(), --n, arr);
  }
  return helper(s, n, arr);
}


/*********************Task #5*********************/
/* Function takes a stream of coefficients for the series s(x) and a
*  natural nuumber n, and returns a closure. When called dwith a real number x, this 
*  closure will return sum of all terms of s(x) up to and including the term of order n.
*/

//evalSeries(s: Stream<T>, n: number): number
function evalSeries(s, n){
  return function f(x){
    let tot = 0 , i = 0;
    function helper(s, n, i, tot){
      if ( n === -1 ) {return tot;}
      if ( s.isEmpty()) {return tot;}
 
      tot += s.head() * Math.pow(x, i);

      return helper(s.tail(), --n, ++i, tot);
    }
    return helper(s, n, i, tot);
  }
}


/*********************Task #6*********************/
/* Function takes a function f and a value v and returns    
*  the stream representing the infinite series s(x) where 
*  a_0 = v and a_k+1 = f(a_k), for all k >= 0.
*/

//rec1Series(f: number => number, v: number): Stream<T>
function rec1Series(f, v){
  function helper(f, v){
    return snode(v, memo0(() => helper(f, f(v))));
  };
  let s = snode(v, memo0(() => helper(f, f(v))));
  return s;
}


/*********************Task #7*********************/
/* Function takes no arguments and returns the Taylor series for   
*  e^x, i.e., the coefficients are a_k = 1/k!.
*/

//expSeries(): Stream<T>
function expSeries(){

  function factorial(n){
    if ( n === 0 || n === 1){
      return 1;
    }
    else {
      return n * factorial(n - 1);
    } 
  }

  function helper(f, val, n){
    ++n;
    return snode( 1/val, memo0(() => helper(f, f(n), n)));
  };
  let s = snode(1, memo0(() => helper(factorial, factorial(1), 1)));
  return s;
}


/*********************Task #8*********************/
/* Function takes two arrays coef and init of same length k.
*  coef = [c_0, c_1, ..., c_k-1] & init = [a_0, a_1, ..., a_k-1]   
*  The function returns an infinte stream of values a_i given by 
*  a k-order recurrencce: the first k values are given by init;
*  the followiing values are given by the relation 
*  a_n+k = (c_0)*(a_n) + (c_1)*(a_n+1) + ... + (c_k-1)*(a_n+k-1)
*/

//recurSeries(coef: number[], init: number[]): Stream<T>
function recurSeries(coef, init){
  let k = init.length, count = 0;

  function helper(count){
    if (count < k){
      return snode(init[count], memo0(() => helper(++count)));
    }
    else {
      function helper1(n){
        let tot = 0;
        for (let j = 0; j < k; ++j){
          tot += (coef[j] * init[j]);
        }
        init.push(tot);
        init.shift()
        return snode(tot, memo0(() => helper1(++n)));
      }
      let n = 0;
      return helper1(n);
    }
  }
  return helper(count);
}


/*********************TESTS*********************/

let s = snode(1, memo0(() => snode(2, memo0(() => snode(3, memo0(() => sempty))))));
let t = snode(2, memo0(() => snode(6, memo0(() => snode(9, memo0(() => sempty))))));


test('Function:- addseries', function() {
  let h = addSeries(s, t).head();
  let t1 = addSeries(s, t).tail().head();
  let t2 = addSeries(s, t).tail().tail().head();

  assert( h === 3);
  assert( t1 === 8);
  assert (t2 === 12);
});

test('Function:- prodSeries', function() {
  let h = prodSeries(s, t).head();
  let t1 = prodSeries(s, t).tail().head();
  let t2 = prodSeries(s, t).tail().tail().head();
  let t3 = prodSeries(s, t).tail().tail().tail().head();
  let t4 = prodSeries(s, t).tail().tail().tail().tail().head();

  assert( h === 2);
  assert( t1 === 10);
  assert( t2 === 27);
  assert( t3 === 36);
  assert( t4 === 27);

});

test('Function:- derivSeries', function() {
  let h = derivSeries(s).head();
  let t1 = derivSeries(s).tail().head();

  assert( h === 2);
  assert( t1 === 6);


});

test('Function:- coeff', function() {
  let v = coeff(s, 2);
  assert( v[0] === 1);
  assert( v[1] === 2);
  assert( v[2] === 3);

  let w = coeff(t, 1);
  assert( w[0] === 2);
  assert( w[1] === 6);

});

test('Function:- evalSeries', function() {
  let v = evalSeries(s, 2);
  let g = v(3)
  assert( g === 34);

  let w = evalSeries(t, 1);
  let h = w(5)
  assert( h === 32);

});

test('Function:- rec1Series', function() {
  let v = rec1Series(x => x + 2, 2);
  assert( v.head() === 2);
  assert( v.tail().head() === 4);
  assert( v.tail().tail().head() === 6);

  let w = rec1Series(x => x * x , 5);
  assert( w.head() === 5);
  assert( w.tail().head() === 25);
  assert( w.tail().tail().head() === 625);
});

test('Function:- expSeries', function() {
  let v = expSeries();
  assert( v.head() === 1);
  assert( v.tail().head() === 1);
  assert( v.tail().tail().head() === 1/2);
  assert( v.tail().tail().tail().head() === 1/6);
  assert( v.tail().tail().tail().tail().head() === 1/24);

});

test('Function:- recurSeries', function() {
  let c = [1,1], a = [1,1];

  let v = recurSeries(c,a);
  assert(v.head() === 1);
  assert(v.tail().head() === 1);
  assert(v.tail().tail().head() === 2);
  assert(v.tail().tail().tail().head() === 3);
  assert(v.tail().tail().tail().tail().head() === 5);
  assert(v.tail().tail().tail().tail().tail().head() === 8);
  assert(v.tail().tail().tail().tail().tail().tail().head() === 13);
  assert(v.tail().tail().tail().tail().tail().tail().tail().head() === 21);

});
