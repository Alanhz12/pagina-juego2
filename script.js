// Desplazamiento suave al hacer clic en los enlaces
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Validación del formulario
document.getElementById('contact-form').addEventListener('submit', function (e) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        e.preventDefault();
        alert('Por favor, completa todos los campos.');
    } else if (!emailPattern.test(email)) {
        e.preventDefault();
        alert('Por favor, introduce un correo electrónico válido.');
    }
});

// Efecto de partículas
particlesJS.load('particles-js', 'particles.json', function () {
    console.log('Efecto de partículas cargado correctamente.');
});