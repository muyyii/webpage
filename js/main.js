// -------- setting up canvas --------
const canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d");

let w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;

c.fillRect(0,0,w, h);
// ----------------------

// -------- function utils -------

function circle(x,y, size = 10){
  c.fillStyle = "#b2deec";
  c.beginPath();
  c.arc(x, y, size, 0, Math.PI*2);
  c.fill();
}

function line(x1, y1, x2, y2, strokeSize = 3, color = "#c56183"){
  c.strokeStyle = color;
  c.lineWidth = strokeSize;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function checkDistance(x1, y1, x2, y2, size){
  let distance = Math.sqrt((x1-x2)*(x1-x2) + (y1 - y2)*(y1 - y2))
  if(distance < size) return true;
  else return false;
}

// ----------------------------------

// -------- main code -------
let point = [{x: w*0.5, y: h*0.5},
             {x: w*0.5 - 75, y: h*0.5 - 100},
             {x: w*0.5 + 40, y: h*0.5 - 100},
             {x: w*0.5 - 100, y: h*0.5 + 130},
             
             {x: 100, y: 100},
             {x: 140, y: 200}];

let middlePoints = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}];

for(let i=0; i<point.length; i++){
  circle(point[i].x, point[i].y, 20)
}

function createSquare(p1, p2, index){
  let distance = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
  let angleP1 =  Math.atan2(p1.x-p2.x, p1.y - p2.y);
  let angleP2 = Math.PI/2 - angleP1;
  
  let p3x = p1.x - Math.cos( Math.PI/2 - angleP1) * distance;
  let p3y = p1.y + Math.sin( Math.PI/2 - angleP1) * distance;
  
  let p4x = p2.x - Math.cos( Math.PI/2 - angleP1) * distance;
  let p4y = p2.y + Math.sin( Math.PI/2 - angleP1) * distance;
  
  line(p1.x, p1.y, p3x, p3y, 2, "#794c74");
  line(p2.x, p2.y, p4x, p4y, 2, "#794c74");
 
  line(p3x, p3y, p4x, p4y, 2, "#794c74");
  
  //let px = ((p1.x*p4y - p1.y*p4x)*(p2.x - p3x) - (p1.x - p4x)*(p2.x*p3y - p2.y*p3x))/ ((p1.x - p4x)*(p2.y - p3y)-(p1.y - p4y)*(p2.x - p3x));
 //let py = ((p1.x*p4y - p1.y*p4x)*(p2.y - p3y) - (p1.y - p4y)*(p2.x*p3y - p2.y*p3x))/ ((p1.x - p4x)*(p2.y - p3y)-(p1.y - p4y)*(p2.x - p3x));
  //circle (px, py, 2);
  
  //middlePoints[index].x = px;
  //middlePoints[index].y = py;
}
// -------- Simplified working cubeBuild -------
function cubeBuild(p1, p2){
  sx = Math.sign(p1.x - p2.x);
  sy = Math.sign(p1.y - p2.y);
  
  cOp = Math.abs(p1.y - p2.y);
  cAd = Math.abs(p1.x - p2.x);
  sqr = Math.sqrt(cOp*cOp + cAd*cAd);
  sinob = cOp/sqr;
  cosib = cAd/sqr;
  
  beta = Math.acos(cosib);
  abeta = 3.14159265/2 - beta;
  
  dirx = sqr*Math.cos(abeta);
  diry = sqr*Math.sin(abeta);
  
  if(sy >= 0){
    pE1 = {x: p1.x + dirx * sx, y: p1.y + diry * -sy};
    pE2 = {x: p2.x + dirx * sx, y: p2.y + diry * -sy};
    if(sx > 0){
      pE1 = {x: p1.x + dirx * -sx, y: p1.y + diry * sy};
      pE2 = {x: p2.x + dirx * -sx, y: p2.y + diry * sy};
    } 
  }
  else{
    pE1 = {x: p1.x + dirx * -sx, y: p1.y + diry * sy};
    pE2 = {x: p2.x + dirx * -sx, y: p2.y + diry * sy};
    
    if(sx > 0){
      pE1 = {x: p1.x + dirx * sx, y: p1.y + diry * -sy};
      pE2 = {x: p2.x + dirx * sx, y: p2.y + diry * -sy};
    } 
  }
  
  // cube 
  line(p1.x, p1.y, p2.x, p2.y);
  line(p1.x, p1.y, pE1.x, pE1.y);
  line(p2.x, p2.y, pE2.x, pE2.y);
  line(pE1.x, pE1.y, pE2.x, pE2.y);
}
// -------- main working test of cube build -------
function createBuild(p1, p2){
  
  sx = Math.sign(p1.x - p2.x);
  sy = Math.sign(p1.y - p2.y);
  
  cOp = Math.abs(p1.y - p2.y);
  cAd = Math.abs(p1.x - p2.x);
  sqr = Math.sqrt(cOp*cOp + cAd*cAd);
  sinob = cOp/sqr;
  cosib = cAd/sqr;
  
  beta = Math.acos(cosib);
  abeta = 3.14159265/2 - beta;
  
  dirx = sqr*Math.cos(abeta);
  diry = sqr*Math.sin(abeta);
  
  if(sy >= 0){
    pE1 = {x: p1.x + dirx * sx, y: p1.y + diry * -sy};
    pE2 = {x: p2.x + dirx * sx, y: p2.y + diry * -sy};
    
    if(sx > 0){
      pE1 = {x: p1.x + dirx * -sx, y: p1.y + diry * sy};
      pE2 = {x: p2.x + dirx * -sx, y: p2.y + diry * sy};
      // opuesto
      // adjacente
      line(p1.x, p1.y, p1.x, p1.y + cOp * -sy);
      line(p1.x, p2.y, p1.x + cAd * -sx , p2.y);
    } else {
      // opuesto
      // adjacente
      line(p2.x, p2.y, p2.x, p2.y + cOp * sy);
      line(p1.x, p1.y, p1.x + cAd * -sx , p1.y);
      // cube 
    }
  }
  else{
    pE1 = {x: p1.x + dirx * -sx, y: p1.y + diry * sy};
    pE2 = {x: p2.x + dirx * -sx, y: p2.y + diry * sy};
    
    if(sx > 0){
      pE1 = {x: p1.x + dirx * sx, y: p1.y + diry * -sy};
      pE2 = {x: p2.x + dirx * sx, y: p2.y + diry * -sy};
      // opuesto
      // adjacente
      line(p2.x, p2.y, p2.x, p2.y + cOp * sy);
      line(p1.x, p1.y, p1.x + cAd * -sx , p1.y);
    } else {
      // opuesto
      // adjacente
      line(p1.x, p1.y, p1.x, p1.y + cOp * -sy);
      line(p1.x, p2.y, p1.x + cAd * -sx , p2.y);
    }
  }
    // cube 
    line(p1.x, p1.y, p2.x, p2.y);
    line(p1.x, p1.y, pE1.x, pE1.y);
    line(p2.x, p2.y, pE2.x, pE2.y);
    line(pE1.x, pE1.y, pE2.x, pE2.y);
}


// -------- Mouse events --------

let mouseX, mouseY, click = false, drag, drag_dx, drag_dy;
document.onmousemove = function(e) {
    
    var event = e || window.event;
    
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    if(click){
      if(drag) {
        point[drag-1].x = mouseX - drag_dx;
        point[drag-1].y = mouseY - drag_dy;
      }
    }
  
  c.fillStyle = "#000";
  c.fillRect(0,0,w, h);
  
  for(let i=0; i<point.length; i++){
    circle(point[i].x, point[i].y, 20)
    if(i<3){
      //line(point[i].x, point[i].y, point[i+1].x, point[i+1].y, 5);
      //createSquare(point[i], point[i+1], i);
      cubeBuild(point[i], point[i+1]);
    }
    else if(i==3) { 
      //line(point[i].x, point[i].y, point[0].x, point[0].y, 5);
      //createSquare(point[i], point[0], i);
      cubeBuild(point[i], point[0]);
    }
  }
  //line(middlePoints[0].x, middlePoints[0].y, middlePoints[2].x, middlePoints[2].y, 5);
  //line(middlePoints[1].x, middlePoints[1].y, middlePoints[3].x, middlePoints[3].y, 5);
  createBuild(point[4], point[5]);
}

document.onmousedown = function(e){
  var event = e || window.event;
  mouseX = event.clientX;
  mouseY = event.clientY;
  click = true;
  
  for(let i=0; i<point.length; i++){
     if(checkDistance(mouseX,mouseY, point[i].x, point[i].y, 20)){
       drag_dx = mouseX - point[i].x;
       drag_dy = mouseY - point[i].y;
       drag = i+1;
     }
  }
}

document.onmouseup = function(e){
  drag = click = false;
}
// ------------------------
