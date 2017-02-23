//make it fit the window and acomidate resiing - couldnt get live resizing to work...



var table;
var text_color = "#FADADD"
var bg_color = "#FEB9C7"
function draw_heart(x,y,s) {
  stroke('#DD6C89');
  fill('#C43B53');
  strokeWeight(2);
  var h_scale = s
  var adj = h_scale/(2*sqrt(2));

  push();
    translate(x, y);
    ellipse(-adj,adj,h_scale,h_scale);
    ellipse(adj,adj,h_scale,h_scale);
    rotate(radians(45));

       push();
       noStroke();
       rect(0, 0, h_scale, h_scale);
       pop();

     noFill();
     beginShape();
     vertex(0, h_scale);
     vertex(h_scale, h_scale);
     vertex(h_scale, 0);
     endShape();

   pop();
}

function Heart(start, x, y) {
  this.speed = 7*random([1,1.5,2,2.5,3]);
  wh = (windowHeight/10)*1.2
  this.h_scale = random(wh*0.5, wh*1);
  if (x == "None"){
  this.x = random(0+this.h_scale/2,width-this.h_scale);
  this.y = random(this.h_scale/2+height, this.h_scale/2+height*1.5);
  }
  //for mouse clicks
  else{
    print("test")
    this.x = x;
    this.y = y-this.h_scale/2;
  }
  this.start = start;

  var start_delay = .75
  this.display = function(play_time) {
    if  (this.y > 0 -this.h_scale*1.2) {
      if (this.start <= play_time-start_delay) {
        //move
        this.x += random(-0, 0);
        this.y += random(-this.speed);
        //display
        draw_heart(this.x, this.y, this.h_scale);
    };
    };
  };
}

function Message(m_text, start) {
  this.m_text= m_text
  this.m_text_length = this.m_text.length;
  this.m_text_size = random(windowHeight/15,windowHeight/10);
  this.width = random(windowWidth*.3334,windowWidth);
  this.height = this.m_text_size*4
  this.h_scale = this.m_text_length*this.m_text_size/200

  this.x = random(0,width-this.width);
  this.speed = 7*random([1,1.5,2,2.5,3]);
  this.y = random(this.h_scale/2+height, this.h_scale/2+height*1.5);
  this.start = start;


  var start_delay = 2
  this.display = function(play_time) {
    if  (this.y > 0 -this.height) {
      if (this.start <= play_time-start_delay) {
        //move
        this.y += random(-this.speed);
        //display
        stroke('pink');
        strokeWeight(4);
        //noStroke();
        textSize(this.m_text_size);
        noFill();
        fill('white')
        //fill(text_color);
        textAlign(CENTER);
        text(this.m_text, this.x, this.y, this.width, this.height);
    };
    };
  };
}

function preload() {
  table = loadTable("assets/nchearts.csv", "csv", "header");
  she = loadSound('assets/nc2x.mp3');

}

//the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");

var hearts = []; // array of heart objects
var messages = []; // array of message objects

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//
//   //blanks the arrays and then refils them based on new window dimensions
//   var hearts = []; // array of heart objects
//   var messages = []; // array of message objects
//
//   print(hearts.length)
//
//   for (var i = 0; i < table.getRowCount(); i++) {
//     var m_text = table.getString(i,'text');
//     if (m_text != ''){
//       //print(m_text)
//       messages.push(new Message(m_text, start_time));
//     }
//
//     var heart_count = int(table.getString(i,'hearts'));
//     var start_time = int(table.getString(i,'duration'));
//
//     for (var j = 0; j < heart_count; j++) {
//       hearts.push(new Heart(start_time, "None", "None"));
//     }
//
//   }
// print(hearts[2])
// print(hearts.length)
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(120);
  noCursor();

  for (var i = 0; i < table.getRowCount(); i++) {
    var m_text = table.getString(i,'text');
    if (m_text != ''){
      print(m_text)
      messages.push(new Message(m_text, start_time));
    }



    var heart_count = int(table.getString(i,'hearts'));
    var start_time = int(table.getString(i,'duration'));

    for (var j = 0; j < heart_count; j++) {
      hearts.push(new Heart(start_time, "None", "None"));
    }

  };



  //count the columns
  print(table.getRowCount() + " total rows in table");
  print(table.getColumnCount() + " total columns in table");
  print(hearts.length + " hearts.");
  she.setVolume(0.1);
  she.play();
}

function draw() {
  //blendMode(REPLACE);
  background(bg_color);
  var play_time = she.currentTime();
  var time = str(floor(play_time));
  var t0 = performance.now();
  for (var i = 0; i < hearts.length; i++) {
    hearts[i].display(time)
  }
  var t1 = performance.now();

  var t0 = performance.now();
  for (var i = 0; i < messages.length; i++) {
    messages[i].display(time)
  }
  var t1 = performance.now();
  draw_heart(mouseX, mouseY, 10);
  if (time>365) {
    window.location.href = 'end.html';
  }

}

function mouseClicked() {
  var play_time = she.currentTime();
  var time = str(floor(play_time));
  hearts.push(new Heart(0, mouseX, mouseY));
}
