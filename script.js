// Toggle del menú hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

const toggleMenu = () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
};

// Abrir/cerrar el menú al hacer clic en el botón hamburguesa
menuToggle.addEventListener('click', toggleMenu);

// Cerrar el menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) { // Si el menú está abierto
            toggleMenu(); // Cerrar el menú
        }
    });
});

// Cerrar el menú al hacer clic fuera del menú
document.addEventListener('click', (event) => {
    const isClickInsideMenu = navLinks.contains(event.target) || menuToggle.contains(event.target);
    if (!isClickInsideMenu && navLinks.classList.contains('active')) {
        toggleMenu(); // Cerrar el menú
    }
});

// Desplazamiento suave
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const offset = 80; // Altura del navbar

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

// Validación del formulario
const contactForm = document.getElementById('contact-form');
const errorMessage = document.getElementById('error-message');

contactForm.addEventListener('submit', function (e) {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    errorMessage.textContent = '';
    errorMessage.classList.remove('active');

    if (!name) {
        e.preventDefault();
        errorMessage.textContent = 'Por favor, ingresa tu nombre.';
        errorMessage.classList.add('active');
    } else if (!email) {
        e.preventDefault();
        errorMessage.textContent = 'Por favor, ingresa tu correo electrónico.';
        errorMessage.classList.add('active');
    } else if (!emailPattern.test(email)) {
        e.preventDefault();
        errorMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
        errorMessage.classList.add('active');
    } else if (!message) {
        e.preventDefault();
        errorMessage.textContent = 'Por favor, ingresa un mensaje.';
        errorMessage.classList.add('active');
    }
});

// Efecto de partículas (solo en desktop)
if (window.innerWidth > 768) {
    particlesJS.load('particles-js', 'particles.json')
        .then(() => console.log('Efecto de partículas cargado correctamente.'))
        .catch(error => console.error('Error al cargar el efecto de partículas:', error));
}