const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

const btnFoto = document.getElementById('btnFoto');
const btnSubir = document.getElementById('btnSubir');
const btnRepetir = document.getElementById('btnRepetir');
const btnCambiar = document.getElementById('btnCambiar');

let stream;
let usandoFrontal = false; 

async function iniciarCamara() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: usandoFrontal ? "user" : "environment"
            }
        });

        video.srcObject = stream;

    } catch (error) {
        alert("Error al acceder a la cámara");
        console.error(error);
    }
}


btnCambiar.addEventListener("click", () => {
    usandoFrontal = !usandoFrontal;
    iniciarCamara();
});


btnFoto.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    video.style.display = "none";
    canvas.style.display = "block";

    btnFoto.style.display = "none";
    btnSubir.style.display = "inline-block";
    btnRepetir.style.display = "inline-block";
});


btnRepetir.addEventListener('click', () => {
    video.style.display = "block";
    canvas.style.display = "none";

    btnFoto.style.display = "inline-block";
    btnSubir.style.display = "none";
    btnRepetir.style.display = "none";
});


btnSubir.addEventListener('click', () => {
    const imagen = canvas.toDataURL("image/png");
    console.log("Imagen lista:", imagen);
    alert("Imagen enviada ");
});

iniciarCamara();