
class FSA{
  constructor(){

    let states = [];
    let curState = undefined;
    let initial = 1;

    class State{
      constructor(name){

        let transitions = [];

        /*returns the name of the state
        */

        //getName(): string
        this.getName = function() { 
          return name; 
        }


        /* changes the name of the state. Assume no other state with
        // the given name exists. Changing the name of a state should not affect FSA behavior.
        */
        //setName(s: string): return this
        this.setName = function(s) { 
          this.name = s; 
          return this; 
        }

        /*adds a transition that on event e moves to state s.
        // It returns this.
        */

        //addTransition(e: string, s: State)
        this.addTransition = function(e, s) {
          if(s === undefined) {
            transitions = [];
            return this;
          }
          transitions.push({key: e, values: s});
          return this;
        }

        /*returns the next state as a result of event e. If several moves exist,
        // it returns one at random; it should be possible to return any successor. If no move exists,
        // return undefined.
        */

        //nextState(e: string):State
        this.nextState = function(e) {
          function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
          }
          let nextStates = this.nextStates(e);
          if (nextStates.length === 0){
            return undefined;
          }
          else{
            let rand = randomInt(0,  nextStates.length);
            return nextStates[rand];
          }
        }



        /* returns an array of all successor states as a result of event e.
        */
        //nextStates(e: string): State[]
        this.nextStates = function(e) {
          let nextStates = [];
          for(let i = 0; i < transitions.length; ++i) {
            if(transitions[i].key === e) {
              nextStates.push(transitions[i].values);
            }
          }
          return nextStates;
        }
      }
    }

    class Memento{
      constructor(){
        let state = undefined;
        
        /*takes a state name as input, and saves it so it can be restored
        */

        //storeState(s: string): void
        this.storeState = function(s) { 
          state = s; 
          return;
        }

        /*which returns the state name stored in the memento object
        */

        //getState(): string
        this.getState = function() { 
          return state; 
        }
      }
    }
     
/* takes as argument an event and returns this. This method changes the
// current state of the automaton by calling the nextState() method of the current state.
// It does nothing if the current state is undefined.
*/

// nextState(e: string) 
    this.nextState = function(e) {
      if(curState !== undefined){
        let newState = curState.nextState(e);
        for(let i = 0; i < states.length; ++i) {
          if(newState !== undefined && states[i].getName() === newState.getName()) {
            curState = states[i];
            return this;
          }
        }
        curState = newState;
      }
      return this;
    }

/* The arguments are a string with
// the name of the state to be created, and an array of transitions. A transition is an object with
// one property: type Transition = { [key: string]: string }, where the key is an event name, and
// the value is the name of the next state on receiving the event. Several transitions may exist
// for one event (the automaton is nondeterministic). If the FSA already has a state with the
// given name, it is replaced.
*/

//createState(s: string, transitions: Transition[]): returns this
    this.createState = function(s, transitions) {
      for(let j = 0; j < states.length; ++j) {
        if(s === states[j].getName()) {
          states[j].addTransition("", undefined);
          for(let i = 0; i < transitions.length; ++i) {
            let val = lib220.getProperty(transitions[i], Object.keys(transitions[i])[0]).value;
            let transitionState = new State(val);
            states[j].addTransition(Object.keys(transitions[i])[0], transitionState);
          }
          return this;
        }
      }
      let newState = new State(s);
      for(let i = 0; i < transitions.length; ++i) {
        let val = lib220.getProperty(transitions[i], Object.keys(transitions[i])[0]).value;
        let transitionState = new State(val);
        newState.addTransition(Object.keys(transitions[i])[0], transitionState);
      }
      states.push(newState);
      
      if(initial === 1) {
        curState = newState;
        initial = 0;
      }
      return this;
    }
    
/*adds a transition to the state with name s,
// using the addTransition method of that state. Adding a transition (including with
// createState()) creates source and target states if they do not already exist.
*/

//addTransition(s: string, t: Transition): returns this
    this.addTransition = function(s, t) {
      let obj = Object.keys(t)[0];
      let val = lib220.getProperty(t, obj).value;
      let transitionState = new State(val);
      for(let i = 0; i < states.length; ++i) {
        if(s === states[i].getName()) {
          states[i].addTransition(obj, transitionState)
          return this;
        }
      }
      let newState = new State(s);
      newState.addTransition(obj, transitionState);
      states.push(newState);
      if(initial === 1) {
        curState = newState;
        initial = 0;
      }
      return this;
    }
    
/* returns the name of the current state, or undefined.
*/

//showState(): string
    this.showState = function() {
      if (curState === undefined){
          return undefined;
        }
        else {
          return curState.getName();
      }
    }
    

/*If a state called oldName exists, renames it
// to newName, else does nothing. Assume no other state called newName exists.
*/

//renameState(oldName, newName): return this
    this.renameState = function(oldName, newName){
        let exists = states.find(x => x.getName() === oldName);
        if (exists !== undefined){
          exists.setName(newName);
        }
        return this;
    }
    
/*creates a memento object with the name of the current state.
*/

//createMemento(): Memento
    this.createMemento = function() {
      let memento = new Memento();
      memento.storeState(curState);
      return memento;
    }
    

/*takes a memento object and restores the FSA state to the
// state named in the memento object; it does nothing if no such state exists. It returns this.
*/

//restoreMemento(m: Memento)
    this.restoreMemento = function(m){
      if (m !== undefined){
        let newCur = states.find(x => x.getName() === m.getState());
        if (newCur !== undefined){
          curState = newCur;
        }
      }
      return this;
    }
  }
}
  
  



/********************TESTS******************************/


let myMachine = new FSA().createState("delicates, low", [{mode: "normal, low"}, {temp: "delicates, medium"}]).createState("normal, low", [{mode: "delicates, low"}, {temp: "normal, medium"}]).createState("delicates, medium", [{mode: "normal, medium"},{temp: "delicates, low"}]).createState("normal, medium", [{mode: "delicates, medium"},{temp: "normal, high"}]).createState("normal, high", [{mode: "delicates, medium"},{temp: "normal, low"}])

myMachine.nextState("temp").nextState("mode").nextState("temp");
let restoreTo = myMachine.createMemento();
console.log(restoreTo.getState());
myMachine.nextState("mode").nextState("temp").restoreMemento(restoreTo)

test("test createState and nextState", function(){ 
  let fsa = new FSA();
  fsa.createState("s1", [{e2: "s2"}, {e3: "s3"}]).createState("s2", [{e1: "s1"}, {e3: "s3"}]);
  assert(fsa.showState() === "s1");
  fsa.nextState("e2");
  assert(fsa.showState() === "s2");
  fsa.nextState("e3");
  assert(fsa.showState() === "s3");

});


test("Tests general addTransition method.", function(){
  let fsa = new FSA();
  fsa.createState("s1", []).addTransition("s1", {e2: "s2"});
  assert(fsa.showState() === "s1");
  fsa.nextState("e2");
  assert(fsa.showState() === "s2");

});


test("Next state and Add transition", function(){  
  let fsa = new FSA().createState("s1",[])  
  assert(fsa.showState() === "s1")  
  fsa.createState("s1",[{change: "s2"}])  
  fsa.addTransition("s1", {next: "s3"})  
  let nxt = fsa.nextState("next").showState()  
  assert(nxt === "s2" || nxt ==="s3")  
  assert(fsa.nextState("adfafdas").showState() === undefined)  
  assert(fsa.nextState("agrwgewt").showState() === undefined)  

  let fsa2 = new FSA().createState("s1",[])  
  fsa2.addTransition("s2", {next: "s3"})  
  fsa2.addTransition("s1", {next: "s2"})  
  assert(fsa2.showState() === "s1")  
  assert(fsa2.nextState("next").showState() === "s2")  
  assert(fsa2.nextState("next").showState() === "s3")

  let fsa3 = new FSA().addTransition("s1", {next: "s2"}).createState("s3",[]).addTransition("s2", {next: "s3"})  
  assert(fsa3.showState() === "s1")  
  assert(fsa3.nextState("next").showState() === "s2") 
  assert(fsa3.nextState("next").showState() === "s3")
});

