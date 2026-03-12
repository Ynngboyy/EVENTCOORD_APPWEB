import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const urlParams = new URLSearchParams(window.location.search);
const eventoId = urlParams.get('eventoId');

async function initDetalles() {
    if (!eventoId) {
        window.location.href = "index.html";
        return;
    }

    try {
        const docRef = doc(db, "eventos", eventoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // MAPEO A TU DATA CLASS DE KOTLIN
            if(document.getElementById('TxtNombre')) 
                document.getElementById('TxtNombre').innerText = data.titulo || "Sin título";
            
            if(document.getElementById('TxtFecha')) 
                document.getElementById('TxtFecha').innerText = data.fecha || "Pendiente";

            if(document.getElementById('TxtUbicacion')) 
                document.getElementById('TxtUbicacion').innerText = data.lugar || "No especificada";

            if(document.getElementById('TxtHora')) 
                document.getElementById('TxtHora').innerText = data.hora || "";

            // Configuramos el enlace a la cámara para que lleve el ID
            const btnCamara = document.getElementById('btnIrCamara');
            if(btnCamara) {
                btnCamara.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = `camara.html?eventoId=${eventoId}`;
                };
            }
        } else {
            alert("Evento no encontrado.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error Firebase:", error);
    }
}

initDetalles();