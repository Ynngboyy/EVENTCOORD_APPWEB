import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_cgISL_BCa7AYBTpmJRDMlVoyrbiBXDQ",
  authDomain: "eventcoord.firebaseapp.com",
  projectId: "eventcoord",
  storageBucket: "eventcoord.firebasestorage.app",
  messagingSenderId: "891770263096",
  appId: "1:891770263096:web:b187aa59c992bf900cf8cd",
  measurementId: "G-YRCTQ8XGWT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const eventoId = urlParams.get('eventoId');

console.log("El ID que llegó del QR es: ->", eventoId, "<-");

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
            console.log("¡Datos descargados de Firebase!", data);
            
            if(document.getElementById('txtNombreEvento')) 
                document.getElementById('txtNombreEvento').innerText = data.titulo || "Sin título";
            
            if(document.getElementById('txtFechaEvento')) 
                document.getElementById('txtFechaEvento').innerText = `${data.fecha || ""} ${data.hora || ""}`;

            if(document.getElementById('txtUbicacionEvento')) 
                document.getElementById('txtUbicacionEvento').innerText = data.lugar || "No especificada";

            if(document.getElementById('txtDescripcionEvento')) 
                document.getElementById('txtDescripcionEvento').innerText = data.descripcion || "Sin descripción adicional";

            const btnCamara = document.getElementById('btnCamaraLink');
            if(btnCamara) {
                btnCamara.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = `subirimagen.html?eventoId=${eventoId}`; 
                };
            }
        } else {
            alert("Evento no encontrado.");
            window.location.href = "indexQR.html";
        }
    } catch (error) {
        console.error("Error Firebase:", error);
    }
}

initDetalles();