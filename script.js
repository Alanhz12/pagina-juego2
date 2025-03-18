// Toggle del menú hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const overlay = document.getElementById('overlay');

const toggleMenu = () => {
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    menuToggle.classList.toggle('active'); // Agregado para animar el botón hamburguesa
};

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Cerrar el menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', toggleMenu);
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

            // Cerrar el menú en móviles después de hacer clic
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
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