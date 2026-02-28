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
      Swal.fire('Error', 'No se pudo acceder a la cámara', 'error');
    });
};

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  }
  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
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

qrcode.callback = (respuesta) => {
  if (respuesta) {
    document.getElementById('audioScaner').play();
    Swal.fire({
        title: 'ESCANEADO',
        text: respuesta,
        icon: 'success',
        confirmButtonColor: '#00468b'
    });
    cerrarCamara();
  }
};