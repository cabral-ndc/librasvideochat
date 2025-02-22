// Mudança de cor do menu ao rolar a página
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animações de revelação ao rolar
ScrollReveal().reveal('.reveal', {
    origin: 'bottom',
    distance: '50px',
    duration: 800,
    delay: 200,
    reset: false
});
