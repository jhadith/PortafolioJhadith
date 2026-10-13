// Update the year in the footer.
document.getElementById('anio').textContent = new Date().getFullYear();

// Subtract the navigation height so the introduction fits on screen.
const cabecera = document.querySelector('header');
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--altura-nav', `${cabecera.offsetHeight}px`);
}).observe(cabecera);

// Animate each block once when it enters the viewport.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.animate(
          [{ opacity: 0, transform: 'translateY(25px)' },
           { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'ease-out' }
        );
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card, #habilidades, #contacto')
    .forEach((elemento) => observador.observe(elemento));

  // First entry from the left; subsequent entries from the right.
  const foto = document.querySelector('.foto');
  let visible = false;
  let primeraEntrada = true;
  let animacion;

  function animarFoto() {
    const posicion = foto.getBoundingClientRect();
    const limite = document.querySelector('header').getBoundingClientRect().bottom;
    const enPantalla = posicion.bottom > limite + 40 && posicion.top < window.innerHeight - 40;
    if (enPantalla === visible) return;

    const estadoActual = getComputedStyle(foto);
    const desde = { opacity: estadoActual.opacity, transform: estadoActual.transform };
    if (animacion) animacion.cancel();

    if (enPantalla && primeraEntrada) {
      desde.opacity = 0;
      desde.transform = 'translateX(-100vw)';
    }

    animacion = foto.animate(
      [desde, { opacity: enPantalla ? 1 : 0,
        transform: enPantalla ? 'translateX(0)' : 'translateX(100vw)' }],
      { duration: 800, easing: 'ease-in-out', fill: 'forwards' }
    );
    visible = enPantalla;
    primeraEntrada = false;
  }

  // If the page opens already scrolled, prepare an entry from the right.
  foto.style.opacity = '0';
  foto.style.transform = 'translateX(100vw)';
  window.addEventListener('scroll', animarFoto, { passive: true });
  document.querySelector('.hero').addEventListener('scroll', animarFoto, { passive: true });
  window.addEventListener('resize', animarFoto);
  animarFoto();
}

