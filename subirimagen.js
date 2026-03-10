// --- IMPORTARMOS FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    api_key: "AIzaSyD_cgISL_BCa7AYBTpmJRDMlVoyrbiBXDQ",
    authDomain: "eventcoord.firebaseapp.com",
    projectId: "eventcoord",
    storageBucket: "eventcoord.firebasestorage.app",
    messagingSenderId: "891770263096",
    appId: "1:891770263096:web:b187aa59c992bf9000cf8cd",
    measurementId: "G-YRCTQ8XGWT"
}

// --- INICIALIZAMOS FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btnFoto = document.getElementById('btnFoto');
const btnSubir = document.getElementById('btnSubir');
const btnRepetir = document.getElementById('btnRepetir');
const btnCambiar = document.getElementById('btnCambiar');

// --- VARIABLES DE CLOUDINARY ---
const CLOUD_NAME = 'duzpc08q3'; 
const UPLOAD_PRESET = 'eventcoord_uploads'; 

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

const parametrosURL = new URLSearchParams(window.location.search);

// Extraemos específicamente el que se llama 'eventoId'
const eventoIdActivo = parametrosURL.get('eventoId');

if (!eventoIdActivo) {
    alert("Error: Escanea un código QR válido del evento.");
}

// --- INTEGRACIÓN CON CLOUDINARY + FIREBASE ---
btnSubir.addEventListener('click', async () => {
    // Estado del botón a la hora de subir
    const textoOriginal = btnSubir.innerText;
    btnSubir.innerText = "Subiendo...";
    btnSubir.disabled = true;

    // Obtenemos la imagen
    const imagenBase64 = canvas.toDataURL("image/png");

    // Se preparan los datos
    const formData = new FormData();
    formData.append('file', imagenBase64);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        // Se envia la petición
        const responseCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const dataCloudinary = await responseCloudinary.json();

        if (responseCloudinary.ok) {
            console.log('Imagen en Cloudinary:', dataCloudinary.secure_url);
            
            const eventoIdActivo = "1Bq3p6AZRDYS3IYMdeAb";

            const rutaSubcoleccion = collection(db, "eventos", eventoIdActivo, "fotos_revision");
            // URL que se guarda en Firebase
            const docRef = await addDoc(collection(db, "fotos_revision"), {
                url_imagen: dataCloudinary.secure_url,
                estado: "pendiente",
                fecha_subida: serverTimestamp()
            });
            console.log("Exito! Documento guardado en Firebase con ID: ", docRef.id);
            alert("¡Foto enviada a revision exitosamente!");
            location.reload();
        } else {
            console.error('Error de Cloudinary:', dataCloudinary);
            alert(`Error al subir: ${dataCloudinary.error.message}`);
        }

    } catch (error) {
        console.error('Error general:', error);
        alert("Error de conexión, intenta de nuevo");
    } finally {
        // Se restarura el botón
        btnSubir.innerText = textoOriginal;
        btnSubir.disabled = false;
    }
});

iniciarCamara(); 