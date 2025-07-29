document.addEventListener('DOMContentLoaded', function() {
    
    //  VARIABLES GLOBALES 
    const experienceButtons = document.querySelectorAll('.select-experience-btn');
    const experienceCards = document.querySelectorAll('.experiencia-card');
    const scrollProgress = document.getElementById('scrollProgress');
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    // Datos de las experiencias
    const experiencesData = {
        'clase-privada': {
            name: 'Clase de Cocina Privada con el Chef',
            price: 'Desde S/ 350',
            duration: '3 horas',
            people: '1-4 personas',
            description: 'Una experiencia íntima y personalizada donde aprenderás los secretos de la fusión gastronómica.'
        },
        'nikkei': {
            name: 'Experiencia Nikkei',
            price: 'S/ 180',
            duration: '2.5 horas',
            people: '2 personas',
            description: 'Un viaje gastronómico que celebra la perfecta fusión entre la tradición peruana y la precisión japonesa.'
        },
        'mediterraneo': {
            name: 'Fusión Mediterráneo-Andina',
            price: 'S/ 165',
            duration: '2 horas',
            people: '2 personas',
            description: 'Descubre cómo los sabores del Mediterráneo danzan con los ingredientes ancestrales de los Andes.'
        },
        'chifa': {
            name: 'Chifa Gourmet Experience',
            price: 'S/ 140',
            duration: '1.5 horas',
            people: '2-3 personas',
            description: 'La reinvención elegante de la cocina chino-peruana elevada a nivel gourmet.'
        }
    };
    
    // FUNCIONES DE INICIALIZACIÓN 
    
    function init() {
        console.log('🎁 Página Regala una Experiencia - Choque de Sabores inicializada');
        
        setupScrollEffects();
        setupExperienceSelection();
        setupSmoothScrolling();
        setupAnimationsOnScroll();
        setupContactInteractions();
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            showNotification('¡Bienvenido! Descubre nuestras experiencias gastronómicas únicas', 'welcome');
        }, 1500);
    }

    // EFECTOS DE SCROLL

    function setupScrollEffects() {
        window.addEventListener('scroll', throttle(() => {
            updateScrollProgress();
            handleScrollAnimations();
        }, 16)); // ~60fps
    }
    
    function updateScrollProgress() {
        if (!scrollProgress) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }
    
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.experiencia-card, .step, .testimonio, .reason');
        
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // SELECCIÓN DE EXPERIENCIAS

    function setupExperienceSelection() {
        experienceButtons.forEach(button => {
            button.addEventListener('click', handleExperienceSelection);
        });
        
        experienceCards.forEach(card => {
            card.addEventListener('mouseenter', handleCardHover);
            card.addEventListener('mouseleave', handleCardLeave);
        });
    }
    
    function handleExperienceSelection(event) {
        const button = event.target;
        const experienceType = button.getAttribute('data-experience');
        const experienceData = experiencesData[experienceType];
        
        if (!experienceData) {
            console.error('Experiencia no encontrada:', experienceType);
            return;
        }
        
        // Efecto visual del botón
        const originalText = button.textContent;
        button.textContent = 'SELECCIONADO ✓';
        button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        button.disabled = true;
        
        // Simular selección
        setTimeout(() => {
            showExperienceModal(experienceData);
            
            // Restaurar botón
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 1000);
        
        // Mostrar notificación
        showNotification(`${experienceData.name} seleccionada`, 'success');
        
        // Analytics (simulado)
        trackExperienceSelection(experienceType);
    }
    
    function handleCardHover(event) {
        const card = event.currentTarget;
        card.style.transform = 'translateY(-15px) scale(1.02)';
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    function handleCardLeave(event) {
        const card = event.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
    }
    
    // MODAL DE EXPERIENCIA

    function showExperienceModal(experienceData) {
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'experience-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${experienceData.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="experience-summary">
                        <div class="summary-item">
                            <strong>Precio:</strong> ${experienceData.price}
                        </div>
                        <div class="summary-item">
                            <strong>Duración:</strong> ${experienceData.duration}
                        </div>
                        <div class="summary-item">
                            <strong>Personas:</strong> ${experienceData.people}
                        </div>
                    </div>
                    <p>${experienceData.description}</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="proceedToBooking('${experienceData.name}')">
                            PROCEDER CON LA RESERVA
                        </button>
                        <button class="btn-secondary modal-close-btn">
                            SEGUIR EXPLORANDO
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Estilos del modal
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
        
        // Eventos de cierre
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn, .modal-overlay');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => closeModal(modal));
        });
        
        // Cerrar con ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    function closeModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    }
    
    // NAVEGACIÓN SUAVE

    function setupSmoothScrolling() {
        ctaButtons.forEach(button => {
            button.addEventListener('click', handleSmoothScroll);
        });
    }
    
    function handleSmoothScroll(event) {
        const href = event.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Compensar header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    // ANIMACIONES AL SCROLL

    function setupAnimationsOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animar contadores si existen
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos
        const elementsToAnimate = document.querySelectorAll(
            '.experiencia-card, .step, .testimonio, .reason, .stat-number'
        );
        
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = element.textContent.replace(/\d+/, target);
                clearInterval(counter);
            } else {
                element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 16);
    }
    
    // INTERACCIONES DE CONTACTO

    function setupContactInteractions() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                showNotification('Conectando con Choque de Sabores...', 'info');
                trackContactAttempt('phone');
            });
        });
    }
    
    //  SISTEMA DE NOTIFICACIONES 
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            welcome: '#D4AF37'
        };
        
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: colors[type] || colors.success,
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            zIndex: '10001',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '400px',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '10px',
            opacity: '0.8'
        });
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Función de cierre
        function closeNotification() {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        closeBtn.addEventListener('click', closeNotification);
        
        // Auto-cerrar
        const autoCloseTime = type === 'welcome' ? 4000 : 3000;
        setTimeout(closeNotification, autoCloseTime);
    }
    
    // ANALYTICS Y TRACKING (SIMULADO)
    
    function trackExperienceSelection(experienceType) {
        console.log('📊 Analytics: Experiencia seleccionada -', experienceType);
        // Aquí se integraría con Google Analytics, Facebook Pixel, etc.
    }
    
    function trackContactAttempt(method) {
        console.log('📊 Analytics: Intento de contacto -', method);
        // Tracking de conversiones
    }
    
    // FUNCIONES GLOBALES EXPORTADAS
    
    window.proceedToBooking = function(experienceName) {
        console.log('🎯 Procediendo con reserva:', experienceName);
        showNotification('Redirigiendo al sistema de reservas...', 'info');
        
        // Simular redirección
        setTimeout(() => {
            // window.location.href = 'Reservas.html?experience=' + encodeURIComponent(experienceName);
            console.log('Redirigiría a: Reservas.html?experience=' + encodeURIComponent(experienceName));
        }, 2000);
    };
    
    // UTILIDADES 
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // MANEJO DE ERRORES
    
    window.addEventListener('error', function(e) {
        console.error('❌ Error en la página:', e.error);
        showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
    });
    
    // PERFORMANCE MONITORING
    
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`⚡ Página cargada en ${Math.round(loadTime)}ms`);
        
        if (loadTime > 3000) {
            console.warn('⚠️ Tiempo de carga elevado');
        }
    });
    
    // INICIALIZAR TODO 
    
    init();

    // CLEANUP AL SALIR

    window.addEventListener('beforeunload', function() {
        // Limpiar timers, observers, etc.
        console.log('🧹 Limpiando recursos...');
    });
});

// ESTILOS CSS DINÁMICOS

const dynamicStyles = `
    .notification {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .experience-modal {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(28, 28, 28, 0.8);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: #F8F6F0;
        border-radius: 20px;
        padding: 0;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
        padding: 2rem;
        border-bottom: 1px solid rgba(22, 59, 115, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, rgba(22,59,115,0.05) 0%, rgba(212,175,55,0.05) 100%);
        border-radius: 20px 20px 0 0;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #163B73;
        font-size: 1.5rem;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        color: #163B73;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .modal-close:hover {
        background: rgba(22, 59, 115, 0.1);
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .experience-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: rgba(22, 59, 115, 0.05);
        border-radius: 12px;
    }
    
    .summary-item {
        text-align: center;
        font-size: 0.9rem;
    }
    
    .summary-item strong {
        color: #163B73;
        display: block;
        margin-bottom: 0.2rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }
    
    .modal-actions .btn-primary,
    .modal-actions .btn-secondary {
        flex: 1;
        min-width: 200px;
        text-align: center;
        justify-content: center;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 10px;
        }
        
        .modal-header,
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-actions {
            flex-direction: column;
        }
        
        .modal-actions .btn-primary,
        .modal-actions .btn-secondary {
            min-width: auto;
        }
        
        .experience-summary {
            grid-template-columns: 1fr;
        }
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);