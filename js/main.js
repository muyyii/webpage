// -------- setting up canvas --------
const canvas = document.getElementById("canvas"),
      c = canvas.getContext("2d");

//let w = canvas.width = window.innerWidth,
//    h = canvas.height = window.innerHeight;

let w = canvas.width = 300;
let h = canvas.height = 300;

let windowW = window.innerHeight;
let windowH = window.innerWidth;

let xoff = canvas.getBoundingClientRect().x;
let yoff = canvas.getBoundingClientRect().y;

c.fillRect(0,0,w, h);

// -------- function utils -------
function circle(x,y, size = 10){
	//c.fillStyle = "#b2deec";
	c.fillStyle = "#0099cc";
	c.beginPath();
	c.arc(x, y, size, 0, Math.PI*2);
	c.fill();
}

function checkDistance(x1, y1, x2, y2, size){
	
	let distance = Math.sqrt((x1-x2)*(x1-x2) + (y1 - y2)*(y1 - y2));
	
	if(distance < size) return true;
	else return false;
}

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

// -------- Mouse events --------
let mouseX, mouseY, click = false, drag, drag_dx, drag_dy;
document.onmousemove = function(e) {

	var event = e || window.event;
    
    mouseX = event.clientX - xoff;
    mouseY = event.clientY - yoff;
   	
	if(click){
		if(drag){
			point[drag-1].x = mouseX - drag_dx; 
			point[drag-1].y = mouseY - drag_dy;	
		}
	}

	c.fillStyle = "#000";
	c.fillRect(0,0,w, h);

	for(let i=0; i<point.length; i++){
		circle(point[i].x, point[i].y, 20)
	}
}

document.onmousedown = function(e){
	var event = e || window.event;
	
	mouseX = event.clientX - xoff;
	mouseY = event.clientY - yoff;
	
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

// -------- Other events --------

window.onresize = (e) => {
	let event = e || window.event;
	
	xoff = canvas.getBoundingClientRect().x;
	yoff = canvas.getBoundingClientRect().y;

	windowW = window.innerHeight;
	windowH = window.innerWidth;
};
