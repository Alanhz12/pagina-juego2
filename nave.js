const nave = document.getElementById('nave');
let proyectiles = [];
let modoNaveActivo = false;
let naveX = window.innerWidth / 2;
let naveY = window.innerHeight / 2;
let angulo = 0;
let velocidadX = 0;
let velocidadY = 0;
const aceleracion = 0.2;
const friccion = 0.95;
const velocidadRotacion = 1.5;
const friccionAngular = 0.9;
const velocidadProyectil = 10;

// Estados de las teclas
const teclas = {
    w: false,
    a: false,
    d: false,
};

// Variables del juego
let objetivosRestantes = 5;
let tiempoRestante = 60; // 1 minuto
let juegoActivo = false; // Controla si el juego está en curso
let nivelActual = 1; // Nivel actual del juego

// Elementos del HUD
const tiempoDisplay = document.getElementById('tiempo');
const objetivosDisplay = document.getElementById('objetivos');

// Elementos del cartel de alerta
const alertOverlay = document.getElementById('alertOverlay');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const alertButton = document.getElementById('alertButton');

// Sonido de explosión
const explosionSound = new Audio('assets/explosion.mp3'); // Asegúrate de tener este archivo en tu carpeta assets

// Función para mostrar alertas personalizadas
function mostrarAlerta(titulo, mensaje, mostrarBotonSiguienteNivel = false) {
    alertTitle.textContent = titulo;
    alertMessage.textContent = mensaje;
    alertOverlay.style.display = 'flex';

    // Mostrar u ocultar el botón de siguiente nivel
    if (mostrarBotonSiguienteNivel) {
        alertButton.textContent = 'Siguiente Nivel';
        alertButton.onclick = () => {
            alertOverlay.style.display = 'none';
            siguienteNivel();
        };
    } else {
        alertButton.textContent = 'Reiniciar';
        alertButton.onclick = () => {
            alertOverlay.style.display = 'none';
            reiniciarJuego();
        };
    }
}

// Función para detener el tiempo
function detenerTiempo() {
    juegoActivo = false;
}

// Función para iniciar el tiempo
function iniciarTiempo() {
    juegoActivo = true;
}

// Actualizar el tiempo
function actualizarTiempo() {
    if (juegoActivo && tiempoRestante > 0) {
        tiempoRestante--;
        tiempoDisplay.textContent = tiempoRestante;
        if (tiempoRestante === 0) {
            detenerTiempo();
            mostrarAlerta('¡Tiempo agotado!', `Objetivos restantes: ${objetivosRestantes}`);
        }
    }
}

// Intervalo del temporizador
let intervalo = setInterval(actualizarTiempo, 1000);

// Función para verificar si un punto está dentro de un elemento
function estaSobreElemento(x, y) {
    const elementos = document.querySelectorAll('a, button, img, p, h1, h2, h3, input, textarea, .service-icon, .tech-icon');
    for (const elemento of elementos) {
        const rect = elemento.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            return true;
        }
    }
    return false;
}

// Agregar objetivos sin superponerse con otros elementos
function agregarObjetivos() {
    const anchoPagina = document.documentElement.scrollWidth;
    const altoPagina = document.documentElement.scrollHeight;

    for (let i = 0; i < 5 + nivelActual; i++) { // Aumentar objetivos por nivel
        let x, y;
        let intentos = 0;
        do {
            x = Math.random() * (anchoPagina - 50);
            y = Math.random() * (altoPagina - 50);
            intentos++;
        } while (estaSobreElemento(x, y) && intentos < 100); // Evitar bucles infinitos

        const objetivo = document.createElement('div');
        objetivo.classList.add('objetivo');
        objetivo.textContent = '🎯';
        objetivo.style.position = 'absolute';
        objetivo.style.left = `${x}px`;
        objetivo.style.top = `${y}px`;
        objetivo.style.fontSize = '30px';
        document.body.appendChild(objetivo);
    }
}

// Botón para activar/desactivar el modo "nave"
const botonModoNave = document.createElement('button');
botonModoNave.classList.add('nav-link');
const iconoNave = document.createElement('i');
iconoNave.classList.add('fas', 'fa-space-shuttle');
botonModoNave.appendChild(iconoNave);
botonModoNave.appendChild(document.createTextNode(' Activar Nave'));
const naveButtonContainer = document.getElementById('nave-button-container');
naveButtonContainer.appendChild(botonModoNave);

// Elemento HUD
const hud = document.getElementById('hud');

botonModoNave.addEventListener('click', () => {
    modoNaveActivo = !modoNaveActivo;
    botonModoNave.textContent = modoNaveActivo ? 'Desactivar Nave' : 'Activar Nave';
    nave.style.display = modoNaveActivo ? 'block' : 'none';
    hud.style.display = modoNaveActivo ? 'flex' : 'none'; // Mostrar/ocultar el HUD
    if (modoNaveActivo) {
        naveX = window.innerWidth / 2;
        naveY = window.innerHeight / 2;
        agregarObjetivos();
        iniciarTiempo();
    } else {
        reiniciarJuego();
    }
});

// Reiniciar el juego
function reiniciarJuego() {
    modoNaveActivo = false;
    nave.style.display = 'none';
    objetivosRestantes = 5 + nivelActual; // Aumentar objetivos por nivel
    tiempoRestante = 60; // Reiniciar tiempo a 60 segundos
    tiempoDisplay.textContent = tiempoRestante;
    objetivosDisplay.textContent = objetivosRestantes;
    document.querySelectorAll('.objetivo').forEach(objetivo => objetivo.remove());
    proyectiles.forEach(proyectil => proyectil.element.remove());
    proyectiles = [];
    juegoActivo = false;
}

// Pasar al siguiente nivel
function siguienteNivel() {
    nivelActual++;
    reiniciarJuego();
    modoNaveActivo = true;
    nave.style.display = 'block';
    agregarObjetivos();
    iniciarTiempo();
}

// Actualizar posición y rotación de la nave
function updateNavePosition() {
    // Limitar la posición de la nave a los límites de la página
    const anchoPagina = document.documentElement.scrollWidth;
    const altoPagina = document.documentElement.scrollHeight;
    const margen = 50; // Margen para evitar que la nave se pegue al borde

    // Limitar movimiento horizontal
    if (naveX < margen) {
        naveX = margen;
        velocidadX = 0; // Detener el movimiento horizontal
    } else if (naveX > anchoPagina - margen) {
        naveX = anchoPagina - margen;
        velocidadX = 0; // Detener el movimiento horizontal
    }

    // Limitar movimiento vertical
    if (naveY < margen) {
        naveY = margen;
        velocidadY = 0; // Detener el movimiento vertical
    } else if (naveY > altoPagina - margen) {
        naveY = altoPagina - margen;
        velocidadY = 0; // Detener el movimiento vertical
    }

    // Aplicar la nueva posición de la nave
    nave.style.left = `${naveX}px`;
    nave.style.top = `${naveY}px`;
    nave.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;

    // Desplazar la página para mantener la nave visible (opcional)
    const margenScroll = 100; // Margen para activar el scroll (píxeles desde el borde)
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Desplazar horizontalmente
    if (naveX < scrollX + margenScroll) {
        window.scrollTo(naveX - margenScroll, scrollY);
    } else if (naveX > scrollX + windowWidth - margenScroll) {
        window.scrollTo(naveX - windowWidth + margenScroll, scrollY);
    }

    // Desplazar verticalmente
    if (naveY < scrollY + margenScroll) {
        window.scrollTo(scrollX, naveY - margenScroll);
    } else if (naveY > scrollY + windowHeight - margenScroll) {
        window.scrollTo(scrollX, naveY - windowHeight + margenScroll);
    }
}

// Mover la nave con las teclas
window.addEventListener('keydown', (event) => {
    if (modoNaveActivo && teclas.hasOwnProperty(event.key)) {
        teclas[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (modoNaveActivo && teclas.hasOwnProperty(event.key)) {
        teclas[event.key] = false;
    }
});

// Disparar proyectiles
function disparar() {
    if (!modoNaveActivo) return;

    const proyectil = document.createElement('div');
    proyectil.classList.add('proyectil');
    proyectil.style.left = `${naveX}px`;
    proyectil.style.top = `${naveY}px`;
    document.body.appendChild(proyectil);

    const radianes = (angulo * Math.PI) / 180;
    const velocidadProyectilX = Math.sin(radianes) * velocidadProyectil;
    const velocidadProyectilY = -Math.cos(radianes) * velocidadProyectil;

    proyectiles.push({ element: proyectil, velocidadX: velocidadProyectilX, velocidadY: velocidadProyectilY });
}

// Mover proyectiles y detectar colisiones
function moverProyectiles() {
    proyectiles.forEach((proyectil, index) => {
        const x = parseFloat(proyectil.element.style.left);
        const y = parseFloat(proyectil.element.style.top);

        proyectil.element.style.left = `${x + proyectil.velocidadX}px`;
        proyectil.element.style.top = `${y + proyectil.velocidadY}px`;

        // Eliminar proyectil si sale de la pantalla
        if (x < 0 || x > document.documentElement.scrollWidth || y < 0 || y > document.documentElement.scrollHeight) {
            proyectil.element.remove();
            proyectiles.splice(index, 1);
            return; // Salir de la función para evitar colisiones falsas
        }

        // Detectar colisiones solo con objetivos
        document.querySelectorAll('.objetivo').forEach((objetivo) => {
            if (colision(proyectil.element, objetivo)) {
                explosionSound.play(); // Reproducir sonido de explosión
                crearRuptura(x, y);
                objetivo.remove(); // Eliminar el objetivo
                proyectil.element.remove(); // Eliminar el proyectil
                proyectiles.splice(index, 1);
                objetivosRestantes--;
                objetivosDisplay.textContent = objetivosRestantes;

                // Verificar si se han eliminado todos los objetivos
                if (objetivosRestantes === 0) {
                    detenerTiempo();
                    mostrarAlerta('¡Felicidades!', `Has completado el nivel ${nivelActual}.`, true);
                }
            }
        });
    });
}

// Función para crear el efecto de ruptura
function crearRuptura(x, y) {
    for (let i = 0; i < 20; i++) {
        const particula = document.createElement('div');
        particula.classList.add('ruptura');
        particula.style.left = `${x}px`;
        particula.style.top = `${y}px`;
        const angulo = Math.random() * 2 * Math.PI;
        const velocidad = Math.random() * 100 + 50;
        const gravedad = 0.5;
        particula.style.setProperty('--x', `${Math.cos(angulo) * velocidad}px`);
        particula.style.setProperty('--y', `${Math.sin(angulo) * velocidad + gravedad * 100}px`);
        const tamaño = Math.random() * 8 + 4;
        particula.style.width = `${tamaño}px`;
        particula.style.height = `${tamaño}px`;
        const colores = ['#ff4d4d', '#ff8c66', '#ffcc00', '#ff6666'];
        particula.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        document.body.appendChild(particula);
        particula.addEventListener('animationend', () => particula.remove());
    }
}

// Función para detectar colisiones
function colision(elemento1, elemento2) {
    const rect1 = elemento1.getBoundingClientRect();
    const rect2 = elemento2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Bucle principal del juego
function gameLoop() {
    if (modoNaveActivo) {
        // Rotación de la nave
        if (teclas.a) angulo -= velocidadRotacion;
        if (teclas.d) angulo += velocidadRotacion;

        // Aceleración de la nave
        if (teclas.w) {
            const radianes = (angulo * Math.PI) / 180;
            velocidadX += Math.sin(radianes) * aceleracion;
            velocidadY += -Math.cos(radianes) * aceleracion;
        }

        // Aplicar fricción
        velocidadX *= friccion;
        velocidadY *= friccion;

        // Mover la nave
        naveX += velocidadX;
        naveY += velocidadY;

        // Limitar el movimiento de la nave dentro de la página completa
        updateNavePosition();
        moverProyectiles();
    }
    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
gameLoop();

// Disparar con la barra espaciadora
window.addEventListener('keydown', (event) => {
    if (modoNaveActivo && event.key === ' ') {
        event.preventDefault();
        disparar();
    }
});

// Inicializar posición de la nave
updateNavePosition();