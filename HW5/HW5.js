

class FluentRestaurants{
  
  constructor(jsonData){
    this.data = jsonData;
  }


/*********************Task #1*********************/
/* Method takes a string stateStr and returns a new FluentRestaurants 
*  object in which all restaurants are 
*  located in the given state, stateStr.
*/

//fromState(stateStr: string): FluentRestaurants
  fromState(stateStr){

    this.data = this.data.filter(function(x){
      if (!lib220.getProperty(x, 'state').found){
        return false;
      }
      return x.state === stateStr;
    });
    return this;
  }


/*********************Task #2*********************/
/* Method takes a number rating and returns a new FluentRestaurants 
*  object that holds all restaurants with 
*  rating less than or equal to rating.
*/

//ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating){
    this.data = this.data.filter(function(x){
      if (!lib220.getProperty(x, 'stars').found){
        return false;
      }
      return x.stars <= rating;
    });
    return this;
  }


/*********************Task #3*********************/
/* Method takes a number rating and returns a new FluentRestaurants 
*  object that holds all restaurants with 
*  rating greater than or equal to rating.
*/

//ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating){
    this.data = this.data.filter(function(x){
      if (!lib220.getProperty(x, 'stars').found){
        return false;
      }
      return x.stars >= rating;
    });
    return this;
  }


/*********************Task #4*********************/
/* Method takes a string, categoryStr and produces a new FluentRestaurants 
*  object that holds only the restaurants that have 
*  the provided category, categoryStr.
*/

//category(categoryStr: string): FluentRestaurants
  category(categoryStr){
    this.data = this.data.filter(function(x){
      return (lib220.getProperty(x, 'categories').found && lib220.getProperty(x, 'categories').value.includes(categoryStr))
    });
    return this;
  }


/*********************Task #5*********************/
/* Method takes a string, ambienceStr, and produces a new FluentRestaurants 
*  with restaurants that have the provided ambience, ambienceStr. Each 
*  restaurant object may have an attributes key that may or may not 
*  contain an Ambience key, which itself is an object.
*/

//hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr){
    this.data = this.data.filter(function(x){
      let attr = lib220.getProperty(x, 'attributes');
      if (attr.found){
        let amb = lib220.getProperty(attr.value, 'Ambience');
        if (amb.found){
          let val = lib220.getProperty(amb.value, ambienceStr);
          return (val.found && val.value);
        }
      }
    });
    return this;
  }


/*********************Task #6*********************/
/* Method that returns the "best" restaurant which has a 
*  star rating that is highest. If there is a tie, the one with  
*  higher review_count is taken. If there is a tie with review_count,
*  the first restaurant is picked. If ther is no matching result, returns 
*  and empty object.
*/ 

//bestPlace(): Restaurant | {}
  bestPlace(){
    return this.data.reduce(function(best,e){
      if (!lib220.getProperty(best, 'stars').found){
        return e;
      }
      else if (lib220.getProperty(e, 'stars').value > lib220.getProperty(best, 'stars').value){
        return e;
      }
      else if (lib220.getProperty(e, 'stars').value === lib220.getProperty(best, 'stars').value){
        if (lib220.getProperty(e, 'review_count').value > lib220.getProperty(best, 'review_count').value){
          return e;
        }
        else {
          return best;
        }
      }
      else {
        return best;
      }
    }, {});
  }


/*********************Task #7*********************/
/* Method that returns the "most reviewed" restaurant which has a 
*  review_count that is highest. If there is a tie, the one with  
*  higher stars is taken. If there is a tie with stars, the first 
*  restaurant is picked. If ther is no matching result, returns 
*  and empty object.
*/ 

//mostReviews(): Restaurant | {}
  mostReviews(){
    return this.data.reduce(function(best,e){
      if (!lib220.getProperty(best, 'review_count').found){
        return e;
      }
      else if (lib220.getProperty(e, 'review_count').value > lib220.getProperty(best, 'review_count').value){
        return e;
      }
      else if (lib220.getProperty(e, 'review_count').value === lib220.getProperty(best, 'review_count').value){
        if (lib220.getProperty(e, 'stars').value > lib220.getProperty(best, 'stars').value){
          return e;
        }
        else {
          return best;
        }
      }
      else {
        return best;
      }
    }, {});
  }
}


/*********************TESTS*********************/

let data = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');

const testData = [
  {
    name: "Applebee's",
    state: "NC",
    stars: 4,
    review_count: 6,
    attributes: {
      Ambience: {
        hipster: true,
        trendy: false,
        upscale: false,
        casual: false
      }
    },
  },
  {
    name: "China Garden",
    state: "NC",
    stars: 4,
    review_count: 10,
    attributes: {
      Ambience: {
        hipster: true,
        trendy: true,
        upscale: true,
        casual: true
      }
    },
    categories: [
      "Chinese",
      "Restaurants",
    ]
  },
  {
    name: "Beach Ventures Roofing",
    state: "AZ",
    stars: 3,
    review_count: 30,
    attributes: {
      Ambience: {
        hipster: false,
        trendy: true,
        upscale: false,
        casual: true
      }
    },
  },
  {
    name: "Alpaul Automobile Wash",
    state: "NC",
    stars: 3,
    review_count: 30,
    attributes: {
    },
  }
];

test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});

test('ratingLeq functions correctly', function(){
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').ratingLeq(3).data
  assert(list[0].name === "Alpaul Automobile Wash");

  let tObj1 = new FluentRestaurants(testData);
  let list1 = tObj1.ratingLeq(3).data;
  assert(list1[0].name === "Beach Ventures Roofing");
  assert(list1[1].name === "Alpaul Automobile Wash");
});

test('ratingGeq functions correctly', function(){
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').ratingGeq(4).data;
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");

  let tObj1 = new FluentRestaurants(testData);
  let list1 = tObj1.ratingGeq(3).data;
  assert(list1[0].name === "Applebee's");
  assert(list1[1].name === "China Garden");
  assert(list1[2].name === "Beach Ventures Roofing");
  assert(list1[3].name === "Alpaul Automobile Wash");
});


test('category working correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.category("Chinese").data;
  assert(place[0].name === 'China Garden');

  let tObj1 = new FluentRestaurants(testData);
  let place1 = tObj1.category("Hotels").data;
  assert(place1.length === 0);
});

test('hasAmbience working correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.hasAmbience("hipster").data;
  assert(place[0].name === "Applebee's");
  assert(place[1].name === 'China Garden');

  
  let tObj1 = new FluentRestaurants(testData);
  let place1 = tObj1.hasAmbience("casual").data;
  assert(place1[0].name === 'China Garden');
  assert(place1[1].name === "Beach Ventures Roofing");

});

test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');

  let tObj1 = new FluentRestaurants(testData);
  let place1 = tObj1.bestPlace();
  assert(place1.name === "China Garden");

  let tObj2 = new FluentRestaurants(testData);
  let place2 = tObj2.fromState('PA').bestPlace();
  assert(JSON.stringify(place2) === '{}');
});

test('mostReviews working correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').mostReviews();
  assert(place.name === 'Alpaul Automobile Wash');

  let tObj1 = new FluentRestaurants(testData);
  let place1 = tObj1.mostReviews();
  assert(place1.name === "Beach Ventures Roofing");

  let tObj2 = new FluentRestaurants(testData);
  let place2 = tObj2.fromState('CA').bestPlace();
  assert(JSON.stringify(place2) === '{}');
});

test("Usage for getProperty", function() {
  let obj = { x: 42, y: "hello"};
  assert(lib220.getProperty(obj, 'x').found === true);
  assert(lib220.getProperty(obj, 'x').value === 42);
  assert(lib220.getProperty(obj, 'y').value === "hello");
  assert(lib220.getProperty(obj, 'z').found === false);
});