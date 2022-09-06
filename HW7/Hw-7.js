
/* Helpes check if the value of Expression
*  is same as types of dT (data Type).
*/

//Helper(v: <T>, dT: <S>): boolean
function helper(v, dT){
  return (typeof(v) === typeof(dT)); 
}

/*  Throws an error with a message
*/
//err(str: String): void
function err(str){
  console.log(str);
  assert(false);
}

/*********************Task #1*********************/

/* Given a state object and an AST of an expression as arguments,
*  interpExpression returns the result of the expression (number or boolean)
*  interpExpression(state: State, e: Expr): number | boolean
*  The State type is defined further below.
*  
*  type State = { [key: string]: number | boolean }
*/

//interpExpression(state: State, e: Expr): number | boolean
function interpExpression(state, e){
  if (e.kind === 'number' || e.kind === 'boolean'){
    return e.value;
  }
  else if (e.kind === 'operator'){
    let v1 = interpExpression(state, e.e1);
    let v2 = interpExpression(state, e.e2);
  
    if (e.op === '+') { 
      if ( !helper(v1, 1) && !helper(v2, 1)){
        err("Arguments of '+' must be number");
      } 
      else {
        return (v1 + v2);
      }
    }
    else if (e.op === '-') { 
      if ( !helper(v1, 1) && !helper(v2, 1)){
        err("Arguments of '-' must be number");
      } 
      else {
        return (v1 - v2);
      }
    }
    else if (e.op === '*') {
      if ( !helper(v1, 1) && !helper(v2, 1)){
        err("Arguments of '*' must be number");
      } 
      else {
        return (v1 * v2);
      }
    }
    else if (e.op === '/') {
      if ( !helper(v1, 1) && !helper(v2, 1)){
        err("Arguments of '/' must be number");
      } 
      else {
        return (v1 / v2);
      }
    } 
    else if (e.op === '||') { 
      if (v1 === true){
        return true;
      } 
      else if (!helper(v1, true)){
        err("Arguments of '||' must be boolean");
      }
      else if (!helper(v2, true)) {
        err("Arguments of '||' must be boolean");
      } 
      else {
        return (v1 || v2);
      }
    }
    else if (e.op === '&&') { 
      if (v1 === false){
        return false;
      } 
      else if (!helper(v1, true)){
        err("Arguments of '&&' must be boolean");
      }
      else if (!helper(v2, true)){
        err("Arguments of '&&' must be boolean");
      } 
      else {
        return (v1 && v2);
      }
    } 
    else if (e.op === '<') {
      if ( !helper(v1, 1) && !helper(v2, 1)){
        err("Arguments of '<' must be number");
      } 
      else {
        return (v1 < v2);
      }
    }
    else if (e.op === '>') {
      if ( !helper(v1, 1) && !helper(v2, 1)){
        err("Arguments of '>' must be number");
      } 
      else {
        return (v1 > v2);
      }
    } 
    else if (e.op === '===') { 
      return v1 === v2;
    }
  }
  else if (e.kind === 'variable'){
    function var_Help(state, str){
      let val = lib220.getProperty(state, str);
      if (val.found){
        return val.value;   
      } 
      else if (!lib220.getProperty(state, "scope").found) {
        err("Variable Unavailable");
      }
      else {
        return var_Help(lib220.getProperty(state, "scope").value, str);
      }
    }
    return var_Help(state, e.name);
  }
  else {
    assert(false);
  }
}


function blockHelp(state, s){
    s.reduce( (acc, e) => {
      interpStatement(state, e);
      return state;
    }, state);
}

/*********************Task #2*********************/

/* Given a state object and an AST of a statement,
*  interpStatement updates the state object and returns nothing
*/

//interpStatement(state: State, p: Stmt): void
function interpStatement(state, p){
    if (p.kind === 'let'){
      let s = interpExpression(state, p.expression);
      lib220.setProperty(state, p.name, s);
    } 
    else if (p.kind === 'assignment'){
      if (lib220.getProperty(state, p.name).found){
          lib220.setProperty(state, p.name, interpExpression(state, p.expression));
      } 
      else {
        return;
      }
    } 
    else if (p.kind === 'if'){
      let val = interpExpression(state, p.test)
      if (val){
          blockHelp(state, p.truePart);
      } 
      else {
          blockHelp(state, p.falsePart);
      }
    } 
    else if (p.kind === 'while'){
      while(interpExpression(state, p.test)){
        blockHelp(state, p.body);
      }
    } 
    else if (p.kind === 'print'){
      console.log(interpExpression(state, p.expression));
    }
}


/*********************Task #3*********************/

/* Given the AST of a program,
*  interpProgram returns the final state of the program
*/
//interpProgram(p: Stmt[]): State
function interpProgram(p){
    let state = {};
    blockHelp(state, p);
    return state;
}


/*********************TESTS*********************/

test("Multiplication with a variable", function() {
let r = interpExpression({ x: 10 }, parser.parseExpression("x * 2").value);
assert(r === 20);
});

test("Assignment", function() {
let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
assert(st.x === 20);
});

test("Addition", function() {
let st = interpProgram(parser.parseProgram("let x = 10; x = x + 20;").value);
assert(st.x === 30);
});

test("Subtraction", function() {
let st = interpProgram(parser.parseProgram("let x = 50; let y = x - 20;").value);
assert(st.y === 30);
});

test("Division", function() {
let st = interpProgram(parser.parseProgram("let x = 10; x = x / 0;").value);
assert(st.x === Infinity);

st = interpProgram(parser.parseProgram("let x = 10; x = x / 2;").value);
assert(st.x === 5);
});

test("|| and &&", function() {
let r = interpExpression({ x: true, y: false }, parser.parseExpression("x || y").value);
assert(r === true);

r = interpExpression({ x: true, y: false }, parser.parseExpression("x && y").value);
assert(r === false);
});

test("> and <", function() {
let r = interpExpression({ x: 45, y: 56 }, parser.parseExpression("x < y").value);
assert(r === true);

r = interpExpression({ x: 142, y: 1222 }, parser.parseExpression("x > y").value);
assert(r === false);
});

test("===", function() {
let r = interpExpression({ x: 45, y: 45 }, parser.parseExpression("x === y").value);
assert(r === true);

r = interpExpression({ x: "abc", y: "abc" }, parser.parseExpression("x === y").value);
assert(r === true);
});

test("Factorial", function() {
let st = interpProgram(parser.parseProgram("let num = 6; let tot = 1; let i = 2; while (i < num || i === num) { tot = tot * i;i = i + 1;}").value);
assert(st.tot === 720);
});

test("Fibonacci", function() {
let st = interpProgram(parser.parseProgram("let num = 8; let a = 1; let tot = 0; let temp = 0; while (num > 0 || num === 0){ temp = a; a = a + tot; tot = temp; num = num - 1;}").value);
assert(st.tot === 34);
});

test("Scoping and Shorting with operators", function(){
  let st = interpExpression({scope:{x: false, scope:{y: "dsfjak"}}}, parser.parseExpression("x && y").value);
  assert(st === false);

  st = interpExpression({scope:{x: 456, scope:{y:123}}}, parser.parseExpression("x > y").value);
  assert(st === true);
});

