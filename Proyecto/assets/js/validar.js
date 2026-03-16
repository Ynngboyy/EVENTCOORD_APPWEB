// Función para validar el formulario familiar
function validateFamilyForm(formData) {
    const errors = [];

    // Validar nombre de la familia
    if (!formData.familia || formData.familia.trim().length < 5) {
        errors.push('El nombre de la familia debe tener al menos 5 caracteres');
    }

    // Validar selección de asistencia
    if (!formData.asistencia) {
        errors.push('Por favor selecciona si asistirán al evento');
    }

    // Validaciones según la opción de asistencia
    if (formData.asistencia === 'si') {
        // Validar adultos
        if (!formData.adultos || formData.adultos < 0) {
            errors.push('Por favor indica el número de adultos');
        } else if (formData.adultos > 20) {
            errors.push('El número máximo de adultos permitidos es 20');
        }

        // Validar niños
        if (!formData.ninos || formData.ninos < 0) {
            errors.push('Por favor indica el número de niños');
        } else if (formData.ninos > 15) {
            errors.push('El número máximo de niños permitidos es 15');
        }

        // Validar que haya al menos una persona
        const totalPersonas = (parseInt(formData.adultos) || 0) + 
                             (parseInt(formData.ninos) || 0) + 
                             (parseInt(formData.adultosMayores) || 0);
        
        if (totalPersonas === 0) {
            errors.push('Debe haber al menos una persona confirmada');
        } else if (totalPersonas > 30) {
            errors.push('El número total de personas no puede exceder 30');
        }

        // Validar restricciones si son muy largas
        if (formData.restricciones && formData.restricciones.length > 500) {
            errors.push('Las restricciones no pueden exceder los 500 caracteres');
        }
    }

    // Validar motivo si no asisten
    if (formData.asistencia === 'no') {
        if (!formData.motivo || formData.motivo.trim().length < 10) {
            errors.push('Por favor comparte brevemente el motivo de tu ausencia (mínimo 10 caracteres)');
        } else if (formData.motivo.length > 300) {
            errors.push('El motivo no puede exceder los 300 caracteres');
        }
    }

    // Validar mensaje adicional si es muy largo
    if (formData.mensaje && formData.mensaje.length > 500) {
        errors.push('El mensaje adicional no puede exceder los 500 caracteres');
    }

    return errors;
}

// Función para mostrar errores en el formulario
function displayErrors(errors) {
    // Limpiar errores anteriores
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    if (errors.length === 0) return;

    // Crear contenedor de errores generales
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message active';
    errorContainer.style.backgroundColor = '#fff3f3';
    errorContainer.style.padding = '15px';
    errorContainer.style.borderRadius = '8px';
    errorContainer.style.marginBottom = '20px';
    errorContainer.style.border = '1px solid #ff6b6b';

    errorContainer.innerHTML = `
        <strong>Por favor corrige los siguientes errores:</strong>
        <ul style="margin-top: 10px; margin-left: 20px;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;

    const form = document.getElementById('familyForm');
    form.insertBefore(errorContainer, form.firstChild);

    // Scroll al inicio del formulario
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Función para limpiar errores
function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const form = document.getElementById('familyForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'error-message active';
    successMessage.style.backgroundColor = '#e8f5e9';
    successMessage.style.padding = '20px';
    successMessage.style.borderRadius = '8px';
    successMessage.style.marginBottom = '20px';
    successMessage.style.border = '1px solid #4ecdc4';
    successMessage.style.color = '#2e7d32';
    successMessage.style.textAlign = 'center';
    successMessage.style.fontWeight = 'bold';
    
    const asistencia = document.getElementById('asistencia').value;
    if (asistencia === 'si') {
        const adultos = document.getElementById('adultos').value;
        const ninos = document.getElementById('ninos').value;
        const total = (parseInt(adultos) || 0) + (parseInt(ninos) || 0);
        
        successMessage.innerHTML = `
            ✅ ¡Gracias por confirmar tu asistencia!<br>
            <span style="font-size: 14px; margin-top: 10px; display: block;">
                Hemos registrado ${total} persona(s) de tu familia para el evento.
                Te enviaremos más detalles pronto.
            </span>
        `;
    } else if (asistencia === 'no') {
        successMessage.innerHTML = `
            ❤️ Gracias por avisarnos. Lamentamos que no puedas acompañarnos.<br>
            <span style="font-size: 14px; margin-top: 10px; display: block;">
                Esperamos contar con tu presencia en futuros eventos.
            </span>
        `;
    } else {
        successMessage.innerHTML = `
            ⏳ Hemos registrado tu respuesta. Por favor confirma lo antes posible.<br>
            <span style="font-size: 14px; margin-top: 10px; display: block;">
                Cualquier cambio, no dudes en contactarnos.
            </span>
        `;
    }

    form.insertBefore(successMessage, form.firstChild);
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}