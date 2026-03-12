import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_cgISL_BCa7AYBTpmJRDMlVoyrbiBXDQ",
    authDomain: "eventcoord.firebaseapp.com",
    projectId: "eventcoord",
    storageBucket: "eventcoord.firebasestorage.app",
    messagingSenderId: "891770263096",
    appId: "1:891770263096:web:b187aa59c992bf9000cf8cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLOUD_NAME = 'duzpc08q3'; 
const UPLOAD_PRESET = 'eventcoord_uploads'; 

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btnFoto = document.getElementById('btnFoto');
const btnSubir = document.getElementById('btnSubir');
const btnRepetir = document.getElementById('btnRepetir');
const btnCambiar = document.getElementById('btnCambiar');
const btnRegresar = document.getElementById('btnRegresar');

let stream;
let usandoFrontal = false; 
const urlParams = new URLSearchParams(window.location.search);
const eventoIdActivo = urlParams.get('eventoId');

async function iniciarCamara() {
    if (stream) stream.getTracks().forEach(track => track.stop());
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: usandoFrontal ? "user" : "environment" }
        });
        video.srcObject = stream;
    } catch (error) {
        alert("Error al acceder a la cámara.");
    }
}

btnCambiar.addEventListener("click", () => {
    usandoFrontal = !usandoFrontal;
    iniciarCamara();
});

btnFoto.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
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

if (btnRegresar) {
    btnRegresar.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `evento_detalle.html?eventoId=${eventoIdActivo}`;
    });
}

btnSubir.addEventListener('click', async () => {
    if (!eventoIdActivo) return alert("ID no encontrado");
    btnSubir.disabled = true;
    btnSubir.innerText = "Subiendo...";

    try {
        const imagenBase64 = canvas.toDataURL("image/jpeg", 0.7);
        const formData = new FormData();
        formData.append('file', imagenBase64);
        formData.append('upload_preset', UPLOAD_PRESET);

        const resCloud = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const dataCloud = await resCloud.json();

        if (resCloud.ok) {
            await addDoc(collection(db, "fotos_revision"), {
                url_imagen: dataCloud.secure_url,
                estado: "pendiente",
                fecha_subida: serverTimestamp(),
                eventoId: eventoIdActivo.trim()
            });
            alert("¡Foto enviada!");
            window.location.href = `evento_detalle.html?eventoId=${eventoIdActivo}`;
        }
    } catch (error) {
        alert("Error al subir.");
        btnSubir.disabled = false;
    }
});

iniciarCamara();