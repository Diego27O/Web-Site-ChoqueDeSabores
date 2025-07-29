    document.addEventListener('DOMContentLoaded', function() {
      // Indicador de scroll
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        
        document.getElementById('scrollProgress').style.width = progress + '%';
        
        // Efecto header al hacer scroll
        const header = document.getElementById('Header');
        header.classList.toggle('scrolled', scrolled > 50);
      });

      console.log('Header simplificado inicializado');
    });