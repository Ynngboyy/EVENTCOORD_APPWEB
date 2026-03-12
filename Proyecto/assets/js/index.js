/**
 * EventCoord - Módulo de Escaneo
 * Detecta el QR y redirige usando el ID del evento.
 */

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const btnScanQR = document.getElementById("btn-scan-qr");
const btnCerrar = document.getElementById("btn-cerrar");

let scanning = false;

const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.style.display = "none";
      btnCerrar.style.display = "block";
      canvasElement.hidden = false;

      video.setAttribute("playsinline", true);
      video.srcObject = stream;
      video.play();
      
      tick();
      scan();
    })
    .catch(err => {
      console.error(err);
      alert("Error: Asegúrate de dar permisos de cámara y usar HTTPS.");
    });
};

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  }
  if (scanning) {
    requestAnimationFrame(tick);
  }
}

function scan() {
  if (!scanning) return;
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 200);
  }
}

const cerrarCamara = () => {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
  }
  canvasElement.hidden = true;
  btnScanQR.style.display = "block";
  btnCerrar.style.display = "none";
  scanning = false;
};

// Respuesta al detectar el QR
qrcode.callback = (respuesta) => {
  if (respuesta) {
    const audio = document.getElementById('audioScaner');
    if (audio) audio.play();

    cerrarCamara();
    const uidEvento = respuesta.trim();

    // Redirección con el parámetro eventoId
    window.location.href = `evento_detalle.html?eventoId=${uidEvento}`;
  }
};