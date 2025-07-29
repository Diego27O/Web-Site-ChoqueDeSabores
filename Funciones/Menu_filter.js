document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los botones de categoría y secciones del menú
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuNav = document.getElementById('menu-nav');
    
    // Variables para sticky navigation
    let navOffset = 0;
    let isSticky = false;
    
    // Calcular la posición inicial del nav
    function calculateNavOffset() {
        navOffset = menuNav.offsetTop;
        console.log('Nav offset calculado:', navOffset);
    }
    
    // Función para manejar el sticky navigation
    function handleStickyNav() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop >= navOffset && !isSticky) {
            // Hacer sticky
            menuNav.classList.add('sticky');
            document.body.classList.add('nav-sticky');
            isSticky = true;
            console.log('Nav ahora está sticky');
        } else if (scrollTop < navOffset && isSticky) {
            // Quitar sticky
            menuNav.classList.remove('sticky');
            document.body.classList.remove('nav-sticky');
            isSticky = false;
            console.log('Nav ya no está sticky');
        }
    }
    
    // Función para mostrar/ocultar categorías
    function filterMenu(selectedCategory) {
        menuCategories.forEach(category => {
            const categoryData = category.getAttribute('data-category');
            
            if (selectedCategory === 'all' || categoryData === selectedCategory) {
                category.classList.remove('filtered-out');
                category.style.display = 'block';
                
                // Animar la entrada
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 50);
            } else {
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
                
                // Ocultar después de la animación
                setTimeout(() => {
                    category.classList.add('filtered-out');
                    category.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Event listeners para los botones de filtro
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filtro clickeado:', this.getAttribute('data-category'));
            
            // Remover clase active de todos los botones
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener la categoría seleccionada
            const selectedCategory = this.getAttribute('data-category');
            
            // Filtrar el menú
            filterMenu(selectedCategory);
            
            // Scroll suave a la sección del menú
            const menuSection = document.getElementById('menu-items');
            if (menuSection) {
                const targetOffset = menuSection.offsetTop - (isSticky ? 120 : 0);
                
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Event listeners para scroll y resize
    window.addEventListener('scroll', handleStickyNav);
    
    window.addEventListener('resize', function() {
        // Recalcular offset en resize
        if (!isSticky) {
            calculateNavOffset();
        }
    });
    
    // Inicializar después de que se cargue todo
    window.addEventListener('load', function() {
        setTimeout(() => {
            calculateNavOffset();
            handleStickyNav(); // Verificar estado inicial
        }, 100);
    });
    
    // También calcular inmediatamente
    setTimeout(() => {
        calculateNavOffset();
    }, 50);
    
    console.log('Sistema de filtros inicializado');
});