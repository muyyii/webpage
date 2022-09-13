const canvas = document.getElementById('canvas'),
  	       c = canvas.getContext('2d');

let texture = new Image();
texture.src = "data:image/png;base64,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";
    
let h = canvas.height = window.innerHeight,
    w = canvas.width  = window.innerWidth;
    
c.imageSmoothingEnabled = false;


var falseCanvas = document.createElement('canvas');
falseCanvas.width = 128;
falseCanvas.height = 48;

var secondFalseCanvas = document.createElement('canvas');
secondFalseCanvas.width = 100;
secondFalseCanvas.height = 100; 
    
// contextos
var secondCtx = secondFalseCanvas.getContext('2d');
let ctx = falseCanvas.getContext('2d');
    
let imageDataBuffer;
let imageCARGADA = false;
    
texture.onload = function(){
    imageCARGADA = true;
    ctx.drawImage(texture, 0, 0);
    imageDataBuffer = ctx.getImageData(0, 0, 128, 48);
}

function returnColorfromImg(x, y){
    let index = (x+128*y)*4;
    let pixelData = { r: imageDataBuffer.data[index + 0],
                      g: imageDataBuffer.data[index + 1],
                      b: imageDataBuffer.data[index + 2],
                      a: imageDataBuffer.data[index + 3] }
    return pixelData
}


let discSize = 100;   
let left = 0;
let topi = 0;

let canvasDataFinal = c.createImageData(discSize, discSize);
let t = 0;    

function draw(){
    for (let x = 0; x < discSize; x++){
        for (let y = 0; y < discSize; y++){
            let px = (x - left) * 2/discSize - 1;
            let py = (y - topi) * 2/discSize -1;
        
            let magSq = px * px + py * py; 
            
            //inverse trig functions
            //Expensive aproach
            let widthAtHeight = Math.sqrt(1 - py * py)
            px = Math.asin(px / widthAtHeight) * 2/3.1415
            py = Math.asin(py) * 2/3.1415
            
            let u = t*5 + (px + 1) * (48/2);
            let v = (py + 1) * (48/2);
            
            u = u % (128);
            
            let index = (x + discSize * y) * 4;
            
            if(imageCARGADA){
                let pixelData = returnColorfromImg(Math.round(u), Math.round(v));
                canvasDataFinal.data[index] = pixelData.r;
                canvasDataFinal.data[index + 1] = pixelData.g;
                canvasDataFinal.data[index + 2] = pixelData.b;
                canvasDataFinal.data[index + 3] = pixelData.a;
            }
            
            if (magSq > 1){
                canvasDataFinal.data[index + 0] = 0;
                canvasDataFinal.data[index + 1] = 0;
                canvasDataFinal.data[index + 2] = 0;
                canvasDataFinal.data[index + 3] = 255;
            }
        }
    }
    
    c.fillStyle = "#000";
    c.fillRect(0, 0 ,w, h);
    
    secondCtx.putImageData(canvasDataFinal, 0, 0);
    
    let scalado = 184;
    
    c.drawImage(secondFalseCanvas, mouseX-scalado/2, mouseY-scalado/2, scalado, scalado);

    t += 0.08
    requestAnimationFrame(draw);
}

var mouseX = 103, 
    mouseY = 103;    
    
draw();
    
window.addEventListener("mousemove", function(e) { 
    mouseX = Math.round(e.clientX);  
    mouseY = Math.round(e.clientY);   
});

