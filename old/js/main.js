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
function circle(x,y, size = 10, color = "#0099cc" ){
	//c.fillStyle = "#b2deec";
	//c.fillStyle = "#0099cc";
	c.fillStyle = color;
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

// -------- Touch Events
function copyTouch(touch) {
	return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
	for (var i = 0; i < ongoingTouches.length; i++) {
		var id = ongoingTouches[i].identifier;

		if (id == idToFind) {
			return i;
		}
	}
	return -1;    // not found
}

const ongoingTouches = [];

canvas.addEventListener("touchstart", handleStart);
canvas.addEventListener("touchend", handleEnd);
canvas.addEventListener("touchcancel", handleCancel);
canvas.addEventListener("touchmove", handleMove);

function handleStart(evt) {
	evt.preventDefault();
	console.log("touchstart.");

	const touches = evt.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		console.log(`touchstart: ${i}.`);
    	
		ongoingTouches.push(copyTouch(touches[i]));
		
		// --- Circle
		//circle(touches[i].pageX - xoff, touches[i].pageY - yoff, 25, "#b2deec")
		
		// ----------------------------------------------- 

		if (i==0){
			mouseX = touches[i].pageX - xoff;
			mouseY = touches[i].pageY - yoff;
	
			click = true;
	
			for(let i=0; i<point.length; i++){
				if(checkDistance(mouseX,mouseY, point[i].x, point[i].y, 20)){
					drag_dx = mouseX - point[i].x;
					drag_dy = mouseY - point[i].y;
					drag = i+1;
				}
			}

		// --- This above is a copy of the mouse code, we have to make it better!
		}
				 
	}

}

function handleMove(evt) {
	evt.preventDefault();
	const touches = evt.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		const idx = ongoingTouchIndexById(touches[i].identifier);

		if (idx >= 0) {
			
			console.log(`continuing touch ${idx}`);
      		console.log(`ctx.moveTo( ${ongoingTouches[idx].pageX}, ${ongoingTouches[idx].pageY} );`);
	  		
			// --- Cricle 
			circle(ongoingTouches[idx].pageX - xoff, ongoingTouches[idx].pageY - yoff, 25, "#b2deec")
      		
			if (i==0){
				mouseX = ongoingTouches[idx].pageX - xoff;
				mouseY = ongoingTouches[idx].pageY - yoff;

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

			ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
    		
			} else {
      			console.log("can't figure out which touch to continue");
			}
	}
}

function handleEnd(evt) {
	
	evt.preventDefault();
	console.log("touchend");
   	const touches = evt.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		
		let idx = ongoingTouchIndexById(touches[i].identifier);

		if (idx >= 0) {
			ongoingTouches.splice(idx, 1); // remove it; we're done

	} else {
		console.log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
	evt.preventDefault();
	console.log("touchcancel.");

	const touches = evt.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		let idx = ongoingTouchIndexById(touches[i].identifier);
		ongoingTouches.splice(idx, 1); // remove it; we're done
	}
}

// -------- Other events --------

window.onresize = (e) => {
	let event = e || window.event;
	
	xoff = canvas.getBoundingClientRect().x;
	yoff = canvas.getBoundingClientRect().y;

	windowW = window.innerHeight;
	windowH = window.innerWidth;
};

const element = document.querySelector("div#scroll-box");

element.addEventListener("scroll", (event) => {
	xoff = canvas.getBoundingClientRect().x;
	yoff = canvas.getBoundingClientRect().y;

		setTimeout(() => { console.log(xoff); }, 1000);
});

