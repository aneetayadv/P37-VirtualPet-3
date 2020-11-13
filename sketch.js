var foodS, foodStock;
var db;
var btnFeed,btnAddFood;
var fedTime =0,lastFed,currentTime;
var foodObj;
var gameState, readState; //P-37
var dog,sadDog,happyDog,garden,washroom;

function preload()
{
  sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");

  garden=loadImage("Images/Garden.png");
  washroom=loadImage("Images/Wash Room.png");
  bedroom=loadImage("Images/Bed Room.png");
}

function setup() {
  var cnv = createCanvas(700, 600);

  foodObj = new Food();

  db = firebase.database();

  var foodRef = db.ref('Food');
  foodRef.on("value",readStock,showError);

  var fedTimeRef = db.ref('FeedTime');
  fedTimeRef.on("value",function(time){
      lastFed = time.val();
  }); 

  var gameStateRef = db.ref('gameState');
  gameStateRef.on("value",function(state){
      gameState = state.val();
  }); 


  dog = createSprite(300,400);
  dog.addImage(sadDog);
  dog.scale = 0.5;

  btnFeed = createButton("Feed Dog");
  btnFeed.position(cnv.width+100,150);
  btnFeed.mousePressed(feedDog);

  btnAddFood = createButton("Add Food");
  btnAddFood.position(cnv.width+200,150);
  btnAddFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  drawSprites();
  text(mouseX +","+mouseY,mouseX,mouseY);

  fill(255);
  push();
  textSize(20);
  stroke(255);
  text("Virtual Pet - 3",width/2-50,50);
  pop();

  // P-37
  currentTime = hour();
  if(currentTime === (lastFed + 1)){
      foodObj.garden();
      update("playing");
  }
  else if(currentTime==(lastFed+2)){
      update("sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
       update("bathing");
      foodObj.washroom();
   }else{
      update("hungry")
      foodObj.display();
   }

  //P-37 
  if(gameState !== "hungry"){
    btnFeed.hide();
    btnAddFood.hide();
    dog.remove();
  }
  else{
    btnAddFood.show();
    btnFeed.show();
    dog.addImage(sadDog);
  }
  console.log(gameState);
  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  db.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState : "hungry"
  })
}

//function to add food in stock
function addFoods(){
  console.log(foodS);
  foodS++;
  db.ref('/').update({
    Food:foodS
  })
}

function showError(err){
  console.log(err);
}

//P-37 update gameState
function update(state){
  db.ref('/').update({
    gameState:state
  })
}