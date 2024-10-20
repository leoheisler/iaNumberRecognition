//control and movement Variables
let isMouseDown = false
let lastX = -1,lastY = -1;
const btn_apagar = document.getElementById("apagar");
const btn_enviar = document.getElementById("enviar");
const canvas = document.getElementById("desenho");

btn_apagar.addEventListener('click',() =>cleanCanvas());
btn_enviar.addEventListener('click',() =>sendImageData());

canvas.addEventListener('mousedown',(e) => setMouseDown(e));
canvas.addEventListener('mousemove',(e) => moveMouse(e));
canvas.addEventListener('mouseup',() => setMouseUp());
canvas.addEventListener('mouseleave', ()=> setMouseUp());

function moveMouse(e){
    if(isMouseDown){
        draw(e);
    }else{
        lastX = -1;
        lastY = -1;
    }

}

function setMouseDown(e) {
    isMouseDown = true;
    draw(e)
}
function setMouseUp() {
    isMouseDown = false
    lastX = -1;
    lastY = -1;
}
function draw(e){
    var ctx = canvas.getContext("2d");
    var bbox = canvas.getBoundingClientRect();
    var x = e.clientX - bbox.left;
    var y = e.clientY - bbox.top;
    ctx.lineWidth = 5;
    if(lastX == -1 && lastY == -1){

        
        var imageData = ctx.getImageData(x, y, 1, 1);
        
        imageData.data[0] = 0;   // Red
        imageData.data[1] = 0;   // Green
        imageData.data[2] = 0;   // Blue
        imageData.data[3] = 255; 
        
        ctx.putImageData(imageData, x, y);

    }else{
        ctx.beginPath(); 
        ctx.moveTo(lastX,lastY); 
        ctx.lineTo(x, y); 
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

function cleanCanvas() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

function sendImageData(){
    canvas.toBlob(function(blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          const base64data = reader.result;

          // Envia a imagem para a API Flask
          fetch('http://localhost:5000/upload-imagedata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64data })  // Envia a imagem como base64
          })
          .then(response => response.json())
          .then(data => {
            console.log('Imagem enviada com sucesso: ' + data.message);
          })
          .catch(error => {
            console.error('Erro:', error);
            console.log('Ocorreu um erro ao enviar a imagem.');
          });
        };
    });
}