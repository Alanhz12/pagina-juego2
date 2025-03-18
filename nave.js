const nave = document.getElementById('nave');
let proyectiles = [];
let modoNaveActivo = false; // Estado del modo "nave"

// Variables de estado de la nave
let naveX = window.innerWidth / 2; // Posición inicial en el centro del viewport
let naveY = window.innerHeight / 2; // Posición inicial en el centro del viewport
let angulo = 0; // Ángulo de rotación de la nave
let velocidadX = 0;
let velocidadY = 0;
const aceleracion = 0.2;
const friccion = 0.95;
const velocidadRotacion = 5;
const velocidadProyectil = 10;

// Estados de las teclas
const teclas = {
    w: false, // Avanzar
    a: false, // Girar a la izquierda
    d: false, // Girar a la derecha
};

// Botón para activar/desactivar el modo "nave"
const botonModoNave = document.createElement('button');
botonModoNave.textContent = 'Activar Nave';
botonModoNave.style.position = 'fixed';
botonModoNave.style.top = '10px';
botonModoNave.style.left = '10px';
botonModoNave.style.zIndex = '1000';
botonModoNave.style.padding = '10px';
botonModoNave.style.backgroundColor = '#00ccff';
botonModoNave.style.color = '#fff';
botonModoNave.style.border = 'none';
botonModoNave.style.borderRadius = '5px';
botonModoNave.style.cursor = 'pointer';
document.body.appendChild(botonModoNave);

// Activar/desactivar el modo "nave"
botonModoNave.addEventListener('click', () => {
    modoNaveActivo = !modoNaveActivo;
    botonModoNave.textContent = modoNaveActivo ? 'Desactivar Nave' : 'Activar Nave';
    nave.style.display = modoNaveActivo ? 'block' : 'none';

    // Quitar el foco del botón después de hacer clic
    botonModoNave.blur();

    // Reiniciar la posición de la nave
    if (modoNaveActivo) {
        naveX = window.innerWidth / 2;
        naveY = window.innerHeight / 2;
        updateNavePosition();
    }
});

// Prevenir que el botón se active con la barra espaciadora
botonModoNave.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault(); // Prevenir el comportamiento predeterminado
    }
});

// Desactivar el desplazamiento de la página con las flechas cuando el modo "nave" está activo
window.addEventListener('keydown', (event) => {
    if (modoNaveActivo && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault(); // Evitar el comportamiento predeterminado (desplazamiento de la página)
    }
});

// Actualizar posición y rotación de la nave
function updateNavePosition() {
    // Coordenadas absolutas respecto al documento
    nave.style.left = `${naveX + window.scrollX}px`;
    nave.style.top = `${naveY + window.scrollY}px`;
    nave.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;

    // Desplazar la página si la nave se acerca a los bordes del viewport
    if (modoNaveActivo) {
        const offset = 100; // Margen para iniciar el desplazamiento
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const documentWidth = document.documentElement.scrollWidth;
        const documentHeight = document.documentElement.scrollHeight;

        // Desplazar horizontalmente
        if (naveX < offset && scrollX > 0) {
            window.scrollBy(-10, 0); // Desplazar hacia la izquierda
            naveX = offset; // Reposicionar la nave lejos del borde
        } else if (naveX > windowWidth - offset && scrollX + windowWidth < documentWidth) {
            window.scrollBy(10, 0); // Desplazar hacia la derecha
            naveX = windowWidth - offset; // Reposicionar la nave lejos del borde
        }

        // Desplazar verticalmente
        if (naveY < offset && scrollY > 0) {
            window.scrollBy(0, -10); // Desplazar hacia arriba
            naveY = offset; // Reposicionar la nave lejos del borde
        } else if (naveY > windowHeight - offset && scrollY + windowHeight < documentHeight) {
            window.scrollBy(0, 10); // Desplazar hacia abajo
            naveY = windowHeight - offset; // Reposicionar la nave lejos del borde
        }
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

// Disparar proyectiles en la dirección de la nave
function disparar() {
    if (!modoNaveActivo) return; // Solo disparar si el modo "nave" está activo

    const proyectil = document.createElement('div');
    proyectil.classList.add('proyectil');
    proyectil.style.left = `${naveX + window.scrollX}px`; // Posición absoluta en el documento
    proyectil.style.top = `${naveY + window.scrollY}px`; // Posición absoluta en el documento
    document.body.appendChild(proyectil);

    // Calcular la dirección del proyectil basado en el ángulo de la nave
    const radianes = (angulo * Math.PI) / 180;
    const velocidadProyectilX = Math.sin(radianes) * velocidadProyectil;
    const velocidadProyectilY = -Math.cos(radianes) * velocidadProyectil;

    proyectiles.push({ element: proyectil, velocidadX: velocidadProyectilX, velocidadY: velocidadProyectilY });
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

// Mover proyectiles y detectar colisiones
function moverProyectiles() {
    proyectiles.forEach((proyectil, index) => {
        const x = parseFloat(proyectil.element.style.left) - window.scrollX; // Convertir a coordenadas del viewport
        const y = parseFloat(proyectil.element.style.top) - window.scrollY; // Convertir a coordenadas del viewport

        proyectil.element.style.left = `${x + window.scrollX + proyectil.velocidadX}px`;
        proyectil.element.style.top = `${y + window.scrollY + proyectil.velocidadY}px`;

        // Eliminar proyectil si sale de la pantalla
        if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
            proyectil.element.remove();
            proyectiles.splice(index, 1);
        }

        // Detectar colisiones con todos los enlaces y botones
        document.querySelectorAll('a, button,img,p,h').forEach((target) => {
            if (colision(proyectil.element, target)) {
                target.remove(); // Eliminar el elemento colisionado
                proyectil.element.remove(); // Eliminar el proyectil
                proyectiles.splice(index, 1);
            }
        });
    });
}

// Actualizar el estado de la nave
function updateNave() {
    if (!modoNaveActivo) return;

    // Rotación de la nave
    if (teclas.a) angulo -= velocidadRotacion; // Girar a la izquierda
    if (teclas.d) angulo += velocidadRotacion; // Girar a la derecha

    // Aceleración de la nave
    if (teclas.w) {
        const radianes = (angulo * Math.PI) / 180;
        velocidadX += Math.sin(radianes) * aceleracion;
        velocidadY += -Math.cos(radianes) * aceleracion;
    }

    // Aplicar fricción para desacelerar la nave
    velocidadX *= friccion;
    velocidadY *= friccion;

    // Mover la nave
    naveX += velocidadX;
    naveY += velocidadY;

    // Limitar el movimiento de la nave dentro del viewport
    naveX = Math.max(0, Math.min(naveX, window.innerWidth));
    naveY = Math.max(0, Math.min(naveY, window.innerHeight));

    updateNavePosition();
}

// Bucle principal del juego
function gameLoop() {
    updateNave();
    moverProyectiles();
    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
gameLoop();

// Disparar con la barra espaciadora
window.addEventListener('keydown', (event) => {
    if (modoNaveActivo && event.key === ' ') {
        event.preventDefault(); // Prevenir el comportamiento predeterminado (desplazamiento de la página)
        disparar();
    }
});

// Inicializar posición de la nave
updateNavePosition();