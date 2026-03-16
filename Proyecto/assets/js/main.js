
/**
 * main.js - Lógica de control para Eventcord
 * Maneja la interactividad, validación y flujo del formulario de asistencia.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const familyForm = document.getElementById('familyForm');
    const asistenciaSelect = document.getElementById('asistencia');
    const detallesAsistencia = document.getElementById('detallesAsistencia');
    const motivoNoAsistencia = document.getElementById('motivoNoAsistencia');

    /**
     * 1. CONTROL DE VISIBILIDAD DINÁMICA
     * Muestra u oculta secciones según la respuesta del usuario.
     */
    if (asistenciaSelect) {
        asistenciaSelect.addEventListener('change', function() {
            const valor = this.value;
            
            // Resetear visibilidad
            detallesAsistencia.style.display = 'none';
            motivoNoAsistencia.style.display = 'none';
            
            // Mostrar según la opción elegida
            if (valor === 'si') {
                detallesAsistencia.style.display = 'block';
            } else if (valor === 'no') {
                motivoNoAsistencia.style.display = 'block';
            }
        });
    }

    /**
     * 2. MANEJO DEL ENVÍO DEL FORMULARIO
     * Valida los datos antes de permitir el "envío" simbólico.
     */
    if (familyForm) {
        familyForm.addEventListener('submit', function(event) {
            // Evitar la recarga de la página
            event.preventDefault();
            
            // Limpiar mensajes de error previos (requiere validar.js)
            if (typeof clearErrors === 'function') {
                clearErrors();
            }
            
            // Recopilación de la información del formulario
            const formData = {
                familia: document.getElementById('familia').value,
                asistencia: document.getElementById('asistencia').value,
                adultos: document.getElementById('adultos')?.value || 0,
                ninos: document.getElementById('ninos')?.value || 0,
                motivo: document.getElementById('motivo')?.value || '',
                mensaje: document.getElementById('mensaje')?.value || ''
            };
            
            // Ejecutar validación externa (requiere validar.js)
            const errors = (typeof validateFamilyForm === 'function') 
                ? validateFamilyForm(formData) 
                : [];
            
            if (errors.length > 0) {
                // Mostrar errores si existen
                displayErrors(errors);
            } else {
                // PROCESO EXITOSO
                console.log('Datos validados correctamente:', formData);
                
                // Mostrar mensaje de éxito en pantalla
                if (typeof showSuccessMessage === 'function') {
                    showSuccessMessage();
                } else {
                    alert("¡Gracias por confirmar tu asistencia!");
                }
                
                // Limpiar el formulario y ocultar campos dinámicos tras 3 segundos
                setTimeout(() => {
                    familyForm.reset();
                    if (detallesAsistencia) detallesAsistencia.style.display = 'none';
                    if (motivoNoAsistencia) motivoNoAsistencia.style.display = 'none';
                }, 3000);
            }
        });
    }
});

/**
 * 3. AJUSTES DE DISEÑO DINÁMICO
 * Asegura que el contenido principal tenga el margen correcto si hay botones flotantes.
 */
window.addEventListener('load', function() {
    const openBtn = document.querySelector('.openbtn');
    const mainContent = document.getElementById('main');
    if (openBtn && mainContent) {
        mainContent.style.marginTop = (openBtn.offsetHeight + 20) + 'px';
    }
});