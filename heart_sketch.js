//hearts spawn too high wen phone tuned sideways and then back again, use canvas size instead of window size? Ya.. this

var table;
var time = 0;

//set colors

var startTime = new Date();
var loadTime = 0;


var bg_color = "#FEB9C7"
var heart_fill = '#C43B53'
var heart_stroke = '#DD6C89'
var text_color = "white"
var text_stroke = 'pink'


//this is the function that draws a heart on the page at (x,y) and s is a scaleing factor. The heart is drawn out of two circes, a rectangle, and a path.
function draw_heart(x,y,s) {
  var heart_scale = s
  var adj = heart_scale/(2*sqrt(2));

//draws two circles with stroke
  push();
    translate(x, y);
    ellipse(-adj,adj,heart_scale,heart_scale);
    ellipse(adj,adj,heart_scale,heart_scale);
    rotate(radians(45));
//draws a rectangle with no stroke covering half of each circle
       push();
       noStroke();
       rect(0, 0, heart_scale, heart_scale);
       pop();
//draws in the missing stroke on the bottom half of the rectangle only
     beginShape();
     vertex(0, heart_scale);
     vertex(heart_scale, heart_scale);
     vertex(heart_scale, 0);
     endShape();

   pop();
}

//This function creates a heart object with a built in display and update position method.
function Heart(start, x, y) {
  //generates a random speed for the heart.
  this.speed = 7*random([1,1.25,1.5,1.75, 2.25, 2.5]);

  //calcuates a scale value for the heart based on the smallest window dimension.
  //fixes window hight incase it changes later
  this.win_height = windowHeight
  var wh = (min(windowHeight,windowWidth)/10)*1.2
  this.heart_scale = random(wh*0.5, wh*1);

  //generates random start postions if none are specified
  if (x == "None"){
  this.x = random(0+this.heart_scale/2,width-this.heart_scale);
  this.y = random(this.heart_scale/2+height, this.heart_scale/2+height*1.5);
  }
  //for mouse clicks, generates postion that is under the click
  else{
    this.x = x;
    this.y = y-this.heart_scale/2;
  }

  this.start = start;

  //adjusts to sync the audio and the animation
  var start_delay = .75
  //this function draws a heart where it is currently located and then moves it based on its speed. only does this for hearts that should be active in the scene
  this.display = function(play_time) {
    //is it off the top of the screen?
    if  (this.y > 0 -this.heart_scale*1.2) {
      //is it time to start showing this heart yet?
      if (play_time-35 < this.start && this.start < play_time-start_delay) {
        //move
        this.x += random(-0, 0);
        this.y += random(-this.speed);
        //draw the heart if it is on screen
        if (this.y < this.win_height + this.heart_scale*1.1){
        draw_heart(this.x, this.y, this.heart_scale);}
    };
    };
  };
}
//This function generates a message object with built in display and update position functions. It's highly similar to Hearts so see comments there too.
function Message(m_text, start) {
  this.m_text= m_text
  //finds the smallest dimension of the window and scales text
  this.text_scale = min(windowHeight,windowWidth)
  this.m_text_size = random(this.text_scale/15,this.text_scale/10);
  //picks a random width for the text box
  this.width = random(windowWidth*.3334,windowWidth);
  //sets text boxes to be 4 lines
  this.height = this.m_text_size*4
  //sets starting position for message, starting position extends well below page so that the objects have time to spread out before being displayed
  this.y = random(this.m_text_size+height, this.m_text_size+height*1.5);
  this.x = random(0,width-this.width);

  //calculates speed from a set of possible values for how long the object should take to cross the screen, based on 60fps
  this.timeonscreen = random([.3,.4,.5,.6,.7]);
  this.speed = windowHeight/(60*this.timeonscreen);

  this.start = start;


  var start_delay = 2
  this.display = function(play_time) {
    if  (this.y > 0 -this.height) {
      if (play_time-14 < this.start && this.start < play_time-start_delay) {
        //updates position based on speed
        this.y += random(-this.speed);
        //displays message
        //sets text size and displays text constrained in its box
        textSize(this.m_text_size);
        text(this.m_text, this.x, this.y, this.width, this.height);
    };
    };
  };
}

function preload() {
  //load in the csv file
  table = loadTable("assets/nchearts.csv", "csv", "header");
  //load in the sound file
  she = loadSound('assets/nc2x.mp3');

}

var hearts = []; // create array for heart objects
var messages = []; // create array for message objects
var frame;
var frame2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //noCursor();

  //scan through table enteries and create a new message for each row where 'text' is not blank
  for (var i = 0; i < table.getRowCount(); i++) {
    var m_text = table.getString(i,'text');
    if (m_text != ''){
      messages.push(new Message(m_text, start_time));
    }


    //scan through table enteries and create the number of hearts specified in the 'hearts' column
    var heart_count = int(table.getString(i,'hearts'));
    var start_time = int(table.getString(i,'duration'));

    for (var j = 0; j < heart_count; j++) {
      hearts.push(new Heart(start_time, "None", "None"));
    }
  };



  //count the columns
  // print(table.getRowCount() + " total rows in table");
  // print(table.getColumnCount() + " total columns in table");
  // print(hearts.length + " hearts.");

  //sets volume and plays track


  // frame = createElement("iframe");
  // frame.attribute("src","https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/191189437&amp;auto_play=true&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=false")
  // loadTime = (new Date()-startTime)/1000;
  // print("loadtime is")
  // print(loadTime)
  // print("dome created")
}

var s2 = 0;
var animate = 0;
function draw() {
  background(bg_color);

if (animate == 0){
  stroke(text_stroke);
  strokeWeight(4);
  noFill();
  fill('white')
  textAlign(CENTER);
  textSize(windowHeight/10);
  text("Tap/Click", windowWidth/2,windowHeight*.9)
}
else {
  // var endTime = new Date();
  // time=(endTime-startTime)/1000 - loadTime;
  //print(loadTime)
  //print(time)

  //find the time the track has been playing for
  var time = she.currentTime();

  //draw and move all the hearts
  //var t0 = performance.now();
  //set heart properties
  stroke(heart_stroke);
  fill(heart_fill);
  strokeWeight(2);
  for (var i = 0; i < hearts.length; i++) {
    hearts[i].display(time)
  }
  //var t1 = performance.now();

  //draw and move all the messages
  //var t0 = performance.now();
  //set text properties
  stroke(text_stroke);
  strokeWeight(4);
  noFill();
  fill(text_color)
  textAlign(CENTER);
  for (var i = 0; i < messages.length; i++) {
    messages[i].display(time)
  }
  //var t1 = performance.now();

// //draws a small hearrt under the mouse cursor
//   stroke(heart_stroke);
//   fill(heart_fill);
//   strokeWeight(2);
//   draw_heart(mouseX, mouseY, 10);

  // if (time >173 && s2 == 0) {
  //   s2 = 1
  //   frame2 = createElement("iframe");
  //   frame2.attribute("src","https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/191189437&amp;auto_play=true&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=false")
  // }


  if (time>340) {
    //location.href = 'index.html'; (desktop ony)
    //window.location.href = 'index_mobile.html';
    window.location = 'index_mobile.html';
  }
}
  //jumps back to index page again (at 340)
}

function touchStarted() {
  if (animate ==0){
    animate = 1;
    she.setVolume(0.1);
    she.play();
  }


  //adds a heart to the hearts array on mouse click ot screen tap
  var time = she.currentTime();
  hearts.push(new Heart(time-1, mouseX, mouseY));
}
