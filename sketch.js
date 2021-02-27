var PLAY = 0;
var END = 1;
var WIN = 2
var PREPLAY = 3;
var gameState = PREPLAY;
var bowman, bowman_walking;
var bowman_draw, yay, bowman2;
var cave, caveImg;
var slime, stone, bee, dead; 
var boss, bossImg, win;
var bossGroup5, princessGroup;
var happy, sad, princess, monster,monsterGroup;
var gameover, gameoverImg;
var arrow1, arrow1Img, goldenarrow, goldenImg;
var arrow2, arrow2Img, goldenarrow2, golden2Img;
var arrow1Group, arrow2Group;
var goldenarrow2Group, goldenarrowGroup;
var left, explosion, explosionImg, ex;
var shoot;
var arrows = 0;
var gold = 0;
var score = 0;
var shot5 = 0;

function preload(){
  bowman2 = loadAnimation("bow4.png")
  bowman_walking = loadAnimation("bow1.png", "bow2.png", "bow3.png", 
  "bow4.png", "bow5.png");
  bowman_draw = loadAnimation("draw1.png", "draw2.png", "draw3.png")
  caveImg = loadImage("Image/cave.jpg");
  bossImg = loadImage("Image/boss.png")
  slime = loadImage("Image/slime monster.png");
  stone = loadImage("Image/stone monster.png");
  bee = loadImage("Image/bee monster.png");
  sad = loadImage("Image/sad princess.png");
  happy = loadImage("Image/happy princess.png");
  goldenImg = loadImage("Image/goldenarrow1.png");
  golden2Img = loadImage("Image/GoldenArrow2.html");
  arrow1Img = loadImage("Image/arrow 1.png");
  arrow2Img = loadImage("Image/arrow2.png");
  gameoverImg = loadImage("Image/gameOver.png");
  explosionImg = loadImage("Image/boom.png");
  winImg = loadImage("Image/win.png");
  shoot = loadSound("Image/shoot.mp3")
  explosion = loadSound("Image/explosion.mp3");
  yay = loadSound("Image/yay.mp3");
}

function setup(){
  createCanvas(1200, 600)  
  cave = createSprite(displayWidth/2, displayHeight/2-100, 1200, displayHeight);
  cave.addImage(caveImg);
  cave.scale = 0.9;
  cave.velocityX=-4;
  cave.x = cave.width/2 - 90;

  bowman = createSprite(200, 500, 30,30);
  bowman.addAnimation("bowman walking",bowman_walking);
  bowman.addAnimation("bowman drawing",bowman_draw);
  bowman.addAnimation("bowman standing",bowman2);
  bowman.scale = 1.5;
  //bowman.debug = true;
  bowman.setCollider("rectangle",0,0,50,100)

  gameover = createSprite(620, 280, 30, 30);
  gameover.addImage(gameoverImg);
  gameover.scale = 1.5
  gameover.visible = false;

  win = createSprite(600, 200, 30, 30);
  win.addImage(winImg);
  win.scale = 1.5
  win.visible = false;

  left = createSprite(-3, 300, 10, 600);
  left.visible = false;

  monsterGroup = new Group;
  arrow1Group = new Group;
  arrow2Group = new Group;
  goldenarrowGroup = new Group;
  goldenarrow2Group = new Group;
  bossGroup5 = new Group;
  princessGroup = new Group;
}

function draw(){
  background(120,255,255)
  if(gameState === PREPLAY){
    bowman.visible = false;
    cave.visible = false;
    fill("darkblue")
    stroke("skyblue");
    textSize(60);
    text("MONSTER SLAYER", 340, 80)

    fill("purple")
    stroke("pink");
    textSize(50);
    text("Instructions:", 470, 160)

    fill("black")
    stroke("black");
    textSize(23);
    text("Press 'LEFT ARROW' KEY to move LEFT", 70, 240);
    text("Press 'RIGHT ARROW' KEY to move RIGHT", 70, 340);
    text("Press 'UP ARROW' KEY to move UP", 70, 440);
    text("Press 'DOWN ARROW' KEY to move DOWN", 70, 540);

    fill("green")
    stroke("green");
    textSize(23);
    text("Press 'SPACE' KEY to shoot ARROWS", 680, 240);
    text("Press 'W' KEY to move shoot Golden ARROW", 680, 340);
    text("Defeat 10 monsters to face the BOSS", 680, 440);
    text("Defeat the BOSS and save the Princess", 680, 540);

    fill("red")
    stroke("red");
    textSize(20);
    text("Press 'ENTER' to START", 50, 120)

    fill("red")
    stroke("red");
    textSize(20);
    text("Press 'ENTER' to START", 930, 120)

    if(keyDown("ENTER")){
      gameState = PLAY;
    }
  }else if(gameState === PLAY){
    bowman.visible = true;
    cave.visible = true;
    if(score < 10){
      spawnmonsters();
    }
    spawnarrows();
    spawngoldarrow();

    if(cave.x<330){
      cave.x = displayWidth/2+220
    }

    if(keyDown(UP_ARROW)){
      bowman.y -= 10 
    }
    if(keyDown(DOWN_ARROW)){
      bowman.y += 10 
    }
    if(keyDown(LEFT_ARROW)){
      bowman.x -= 10 
    }
    if(keyDown(RIGHT_ARROW)){
      bowman.x += 10 
    }

    if(arrow1Group.isTouching(bowman)){
      arrows++;
      arrow1Group.destroyEach();
    }
    if(goldenarrowGroup.isTouching(bowman)){
      gold++;
      goldenarrowGroup.destroyEach();
    }

    if(arrows > 0 && keyDown("SPACE")){
      bowman.changeAnimation("bowman drawing", bowman_draw);
      createarrow();
      arrows = arrows -1;
      shoot.play();
    }

    if(arrows < 0 || arrows === 0){
      arrows = 0;
    }
    if(gold > 0 && keyDown("W")){
      bowman.changeAnimation("bowman drawing", bowman_draw);
      creategoldenarrow();
      gold = gold -1;
      shoot.play();
    }
    if(gold < 0 || gold === 0){
      gold = 0;
    }

    if(arrow2Group.isTouching(monsterGroup)){
      monsterGroup.destroyEach();
      arrow2Group.destroyEach();
      score++;
      bowman.changeAnimation("bowman walking", bowman_walking);
    }

    if(goldenarrow2Group.isTouching(monsterGroup)){
      monsterGroup.destroyEach();
      goldenarrow2Group.destroyEach();
      score = score + 4;
      createex();
      explosion.play();
      bowman.changeAnimation("bowman walking", bowman_walking);
    }

    if(monsterGroup.isTouching(bowman)){
      gameState = END;
    }

    if(score === 10){
      spawnlayer5();
      spawnprincess();
      if(boss.velocityX = -3){
        score = 11
      }
    }
    if(arrow2Group.isTouching(bossGroup5)){
      shot5++;
      arrow2Group.destroyEach();
      bowman.changeAnimation("bowman walking", bowman_walking);
    }
    if(shot5===6){
      bossGroup5.destroyEach();
      yay.play();
      gameState = WIN;
    }
    if(bossGroup5.isTouching(bowman)){
      gameState = END;
    }
    }else if(gameState === END){
      cave.velocityX=0;
      monsterGroup.destroyEach();
      arrow1Group.destroyEach();
      bossGroup5.destroyEach();
      princessGroup.destroyEach();
      gameover.visible=true;
      bowman.visible = false;
    }else if(gameState === WIN){
      win.visible = true;
      cave.velocityX=0;
      princess.velocityX = 0;
      princess.addImage(happy);
      princess.scale = 0.16;
      bowman.x = 550;
      bowman.y = 405;
      princess.x = bowman.x + 120;
      princess.y = bowman.y - 10;
      bowman.changeAnimation("bowman standing", bowman2);
    }

    bowman.collide(left)
    drawSprites();
}

function spawnmonsters(){
  if(frameCount%260===0){
    monster = createSprite(1200, 440, 40, 40);
    var rand = Math.round(random(1,3));
    switch(rand){
      case 1:monster.addImage(stone);
      monster.scale=0.3;
      break;
      case 2:monster.addImage(bee);
      monster.scale=0.5;
      break;
      case 3:monster.addImage(slime);
      monster.scale=0.6;
      break;
    }
    monster.velocityX = -5;
    monster.lifetime = 300;
    //monster.debug=true;
    monster.setCollider("rectangle",0,0,300, 300)
    monsterGroup.add(monster);
  }
}

function spawnlayer5(){
  boss = createSprite(1200, 430, 50, 50);
  boss.addImage(bossImg);
  boss.scale = 1;
  boss.velocityX = -4;
  //boss.debug = true;
  boss.setCollider("rectangle",10,0,200,250)
  bossGroup5.add(boss);
}

function spawnprincess(){
  princess = createSprite(1500, 500, 30, 30);
  princess.addImage(sad);
  princess.scale = 0.3;
  princess.velocityX = -3;
  //princess.debug = true;
  princessGroup.add(princess)
}

function spawnarrows(){
  if(frameCount%90===0){
    arrow1 = createSprite(1200, 440, 20, 20);
    arrow1.y = Math.round(random(320, 520));
    arrow1.addImage(arrow1Img)
    arrow1.scale = 0.3;
    arrow1.velocityX = -6;
    arrow1.lifetime = 200;
    //arrow1.debug = true;
    arrow1Group.add(arrow1)
  }
}

function createarrow(){
  arrow2 = createSprite(300, 300, 20, 20);
  arrow2.x = bowman.x;
  arrow2.y = bowman.y;
  arrow2.addImage(arrow2Img);
  arrow2.scale = 0.2;
  arrow2.lifetime = 300;
  arrow2.velocityX=20;
  arrow2Group.add(arrow2);
  //arrow2.debug = true;
  return arrow2;
}

function spawngoldarrow(){
  if(frameCount%1720===0){
    goldenarrow = createSprite(1200, 440, 20, 20);
    goldenarrow.y = Math.round(random(320, 520));
    goldenarrow.addImage(goldenImg);
    goldenarrow.scale = 0.3;
    goldenarrow.velocityX = -6;
    goldenarrow.lifetime = 200;
    //goldenarrow.debug = true;
    goldenarrow.setCollider("rectangle",-10,0,400,190)
    goldenarrowGroup.add(goldenarrow)
  }
}

function creategoldenarrow(){
  goldenarrow2 = createSprite(300, 300, 20, 20);
  goldenarrow2.x = bowman.x;
  goldenarrow2.y = bowman.y;
  goldenarrow2.addImage(golden2Img);
  goldenarrow2.scale = 0.27;
  goldenarrow2.lifetime = 300;
  goldenarrow2.velocityX=9;
  goldenarrow2Group.add(goldenarrow2);
  //goldenarrow2.debug = true;
  return goldenarrow2;
}

function createex(){
  ex = createSprite(300,300,10,10);
  ex.addImage(explosionImg);
  ex.scale = 0.3;
  ex.x = monster.x;
  ex.y = monster.y;
  ex.lifetime = 20;
}