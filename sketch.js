var dog,Dog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState = 0;
var bedrom,bedroomimg,garden,gardenimg,washroom,washroomimg;

function preload(){
Dog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
milk=loadImage("images/MilkBottleImage.png");
bedroomimg=loadImage("images/MilkBottleImage.png");
gardenimg=loadImage("images/MilkBottleImage.png");
washroomimg=loadImage("images/MilkBottleImage.png");
//sadDog = loadImage("")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(Dog);
  dog.scale=0.3;
  
  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("LastFeed: "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("LastFeed: 12 AM",350,30);
   }else{
     text("LastFeed: "+ lastFed + " AM", 350,30);
   }

   

if (gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();dog.addImage(sadDog);
}
currentTime = hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.Garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
    foodObj.bedRoom();
}else if (currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("Bathing")
  foodObj.washRoom();
}else{
  update("Hungry");
  foodObj.display();
}

 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  imageMode(CENTER);
  image(milk,680,250,100,100);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

 