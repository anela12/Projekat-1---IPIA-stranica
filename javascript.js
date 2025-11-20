

 const canvas = document.getElementById("board");
 const ctx = canvas.getContext("2d");
 
  const colorPicker = document.getElementById("colorPicker");
  const brushSize = document.getElementById("brushSize");
  const clearBtn = document.getElementById("clearBtn");
  const saveBtn = document.getElementById("saveBtn");
  const eraserBtn = document.getElementById("eraserBtn");


let drawing= false;
let currentColor= colorPicker.value;
let isErasing = false;

function startDraw(e){
drawing = true;
draw(e);
}

function endDraw(){
drawing= false;
ctx.beginPath()
}

function draw(e){
if(!drawing) return;
 const rect= canvas.getBoundingClientRect();
 
 const scaleX = canvas.width / rect.width;
 const scaleY = canvas.width / rect.width;
 
 const clientX = e.clientX || e.touches?.[0]?.clientX;
 const clientY = e.clientY || e.touches?.[0]?.clientY;

 const x = (clientX - rect.left) * scaleX;
 const y = (clientY - rect.top) * scaleY;
 
 ctx.lineWidth = brushSize.value;
 ctx.lineCap="round";
 ctx.strokeStyle = isErasing ? "#FFFFFF" : currentColor;
 
 ctx.lineTo(x, y);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(x, y);
 }
 
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mouseup", endDraw);
  canvas.addEventListener("mousemove", draw);

  canvas.addEventListener("touchstart", startDraw);
  canvas.addEventListener("touchend", endDraw);
  canvas.addEventListener("touchmove", (e) => {
    draw(e);
    e.preventDefault();
  });

   colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
    isErasing = false;
    eraserBtn.textContent = "Briši";
  });
 
  eraserBtn.addEventListener("click", () => {
    isErasing = !isErasing;
    eraserBtn.textContent = isErasing ? "Piši" : "Briši";
  });
  
  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
 
 
 saveBtn.addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "moj_crtez.png";
    link.click();
  });

 document.getElementById("pdfBtn").addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const newWindow = window.open("");

    newWindow.document.write(`
        <html>
        <head><title>Snimi PDF</title></head>
        <body style="margin:0">
            <img src="${image}" style="width:100%">
        </body>
        </html>
    `);

    newWindow.document.close();

    
    newWindow.onload = () => {
        newWindow.print();
        newWindow.close();
    };
});

const popup = document.getElementById("emailPopup");
const mailBtn = document.getElementById("mailBtn");
const sendEmailBtn = document.getElementById("sendEmailBtn");
const cancelEmailBtn = document.getElementById("cancelEmailBtn");

mailBtn.addEventListener("click", () => {
    popup.style.display = "flex";   // VAŽNO!
});

cancelEmailBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

sendEmailBtn.addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;

    if (!email) {
        alert("Unesite email adresu!");
        return;
    }

    const image = canvas.toDataURL("image/png");

    const link = `mailto:${email}?subject=Moj%20crtez&body=Ovo%20je%20slika%20crteza.%0A%0A${image}`;

    window.location.href = link;

    popup.style.display = "none";
});
