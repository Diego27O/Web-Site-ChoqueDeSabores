document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reserva-form');
    const modal = document.getElementById('modal-confirmacion');
    
    // Configurar fecha mínima (hoy)
    const fechaInput = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
    
    // Configurar fecha máxima (3 meses adelante)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    fechaInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Función de validación individual
    function validateField(field) {
        const fieldGroup = field.closest('.form-group');
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remover estados previos
        fieldGroup.classList.remove('error', 'success');
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validaciones específicas
        switch (fieldName) {
            case 'nombre':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'El nombre es obligatorio';
                } else if (field.value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'El nombre solo puede contener letras';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'El email es obligatorio';
                } else if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                break;
                
            case 'telefono':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'El teléfono es obligatorio';
                } else if (!phoneRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Ingresa un teléfono válido';
                }
                break;
                
            case 'fecha':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'La fecha es obligatoria';
                } else {
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'La fecha no puede ser anterior a hoy';
                    }
                    
                    // Verificar si es lunes (día cerrado)
                    if (selectedDate.getDay() === 1) {
                        isValid = false;
                        errorMessage = 'Los lunes permanecemos cerrados';
                    }
                }
                break;
                
            case 'hora':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'La hora es obligatoria';
                }
                break;
                
            case 'personas':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Número de personas es obligatorio';
                }
                break;
                
            case 'acepto-terminos':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Debes aceptar los términos y condiciones';
                }
                break;
        }
        
        // Aplicar estilos y mostrar errores
        if (isValid) {
            fieldGroup.classList.add('success');
        } else {
            fieldGroup.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            fieldGroup.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    // Validación completa del formulario
    function validateForm() {
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') || input.name === 'acepto-terminos') {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            }
        });
        
        return isFormValid;
    }
    
    // Simulación de disponibilidad
    function checkAvailability(fecha, hora, personas) {
        // Simulamos algunas horas ocupadas
        const ocupadas = {
            [today]: ['19:00', '20:30'],
            '2025-07-27': ['20:00'],
            '2025-07-28': ['19:00', '19:30', '20:00']
        };
        
        const fechaOcupadas = ocupadas[fecha] || [];
        
        if (fechaOcupadas.includes(hora)) {
            return {
                available: false,
                message: 'Lo sentimos, este horario no está disponible. Por favor selecciona otra hora.'
            };
        }
        
        if (parseInt(personas) > 8) {
            return {
                available: true,
                message: 'Para grupos de más de 8 personas, nos pondremos en contacto contigo para confirmar disponibilidad.',
                requiresConfirmation: true
            };
        }
        
        return { available: true };
    }
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll al primer error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Verificar disponibilidad
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const personas = document.getElementById('personas').value;
        
        const availability = checkAvailability(fecha, hora, personas);
        
        if (!availability.available) {
            alert(availability.message);
            return;
        }
        
        // Mostrar loading
        const submitBtn = form.querySelector('.btn-reservar');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        
        // Simular envío (reemplazar con llamada real a la API)
        setTimeout(() => {
            // Resetear botón
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            
            // Mostrar confirmación
            mostrarConfirmacion(availability.requiresConfirmation);
            
            // Limpiar formulario
            form.reset();
            
            // Remover estados de validación
            inputs.forEach(input => {
                const fieldGroup = input.closest('.form-group');
                fieldGroup.classList.remove('error', 'success');
                const errorMsg = fieldGroup.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
            
        }, 2000);
    });
    
    // Mostrar modal de confirmación
    function mostrarConfirmacion(requiresConfirmation = false) {
        const nombre = document.getElementById('nombre').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const personas = document.getElementById('personas').value;
        
        // Formatear fecha
        const fechaObj = new Date(fecha + 'T00:00:00');
        const fechaFormateada = fechaObj.toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Formatear hora
        const horaFormateada = new Date('2000-01-01T' + hora + ':00').toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        // Llenar datos en el modal
        document.getElementById('confirm-nombre').textContent = nombre;
        document.getElementById('confirm-fecha').textContent = fechaFormateada;
        document.getElementById('confirm-hora').textContent = horaFormateada;
        document.getElementById('confirm-personas').textContent = personas + (personas == 1 ? ' persona' : ' personas');
        
        // Ajustar mensaje si requiere confirmación
        if (requiresConfirmation) {
            const modalBody = modal.querySelector('.modal-body .confirmacion-texto');
            modalBody.textContent = 'Hemos recibido tu solicitud de reserva para un grupo grande. Nos pondremos en contacto contigo dentro de las próximas 2 horas para confirmar la disponibilidad.';
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Cerrar modal
    window.cerrarModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            cerrarModal();
        }
    });
    
    // Cerrar modal con el botón X
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', cerrarModal);
    
    // Actualizar horarios disponibles según la fecha
    horaSelect = document.getElementById('hora');
    
    fechaInput.addEventListener('change', function() {
        actualizarHorariosDisponibles(this.value);
    });
    
    function actualizarHorariosDisponibles(fecha) {
        const selectedDate = new Date(fecha);
        const dayOfWeek = selectedDate.getDay();
        
        // Limpiar opciones actuales (excepto la primera)
        while (horaSelect.children.length > 1) {
            horaSelect.removeChild(horaSelect.lastChild);
        }
        
        let horarios = [];
        
        // Horarios según el día
        if (dayOfWeek === 0) { // Domingo
            horarios = ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00'];
        } else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Lunes a Jueves
            horarios = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
        } else { // Viernes y Sábado
            horarios = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
        }
        
        // Agregar opciones
        horarios.forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            
            // Formatear hora para mostrar
            const horaFormateada = new Date('2000-01-01T' + hora + ':00').toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            option.textContent = horaFormateada;
            horaSelect.appendChild(option);
        });
        
        // Marcar horarios ocupados
        const ocupadas = {
            [today]: ['19:00', '20:30'],
            '2025-07-27': ['20:00'],
            '2025-07-28': ['19:00', '19:30', '20:00']
        };
        
        const fechaOcupadas = ocupadas[fecha] || [];
        fechaOcupadas.forEach(horaOcupada => {
            const option = horaSelect.querySelector(`option[value="${horaOcupada}"]`);
            if (option) {
                option.disabled = true;
                option.textContent += ' (No disponible)';
                option.style.color = '#dc3545';
            }
        });
    }
    
    // Actualizar disponibilidad en tiempo real (simulación)
    function actualizarDisponibilidadTiempoReal() {
        const horariosElements = document.querySelectorAll('.horario');
        
        horariosElements.forEach(horario => {
            // Simular cambios aleatorios de disponibilidad
            if (Math.random() < 0.1) { // 10% de probabilidad de cambio
                if (horario.classList.contains('disponible')) {
                    horario.classList.remove('disponible');
                    horario.classList.add('ocupado');
                } else if (horario.classList.contains('ocupado') && Math.random() < 0.3) {
                    horario.classList.remove('ocupado');
                    horario.classList.add('disponible');
                }
            }
        });
    }
    
    // Actualizar cada 30 segundos
    setInterval(actualizarDisponibilidadTiempoReal, 30000);
    
    // Funcionalidad para seleccionar horarios de disponibilidad
    const horariosDisponibles = document.querySelectorAll('.horario.disponible');
    horariosDisponibles.forEach(horario => {
        horario.addEventListener('click', function() {
            const hora = this.textContent;
            const horaSelect = document.getElementById('hora');
            
            // Buscar y seleccionar la opción correspondiente
            for (let option of horaSelect.options) {
                if (option.value === hora) {
                    option.selected = true;
                    horaSelect.dispatchEvent(new Event('change'));
                    break;
                }
            }
            
            // Scroll al formulario
            document.getElementById('reservas-main').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Mejorar UX con autocompletado de campos
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    
    // Capitalizar nombres automáticamente
    nombreInput.addEventListener('input', function() {
        const words = this.value.split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word;
        });
        this.value = capitalizedWords.join(' ');
    });
    
    // Formatear teléfono automáticamente
    telefonoInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Solo números
        if (value.length > 0) {
            if (value.startsWith('51')) {
                // Formato internacional
                value = '+' + value;
            } else if (value.length === 9) {
                // Formato nacional
                value = '+51 ' + value;
            }
        }
        this.value = value;
    });
    
    // Prevenir envío múltiple del formulario
    let formSubmitting = false;
    form.addEventListener('submit', function(e) {
        if (formSubmitting) {
            e.preventDefault();
            return false;
        }
        formSubmitting = true;
        
        // Reset después de 3 segundos
        setTimeout(() => {
            formSubmitting = false;
        }, 3000);
    });
    
    console.log('Sistema de reservas inicializado correctamente');
});