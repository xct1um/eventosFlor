/* fetch('eventos.json')
  .then(respuesta => respuesta.json())
  .then(data => {
    console.log("Eventos cargados:", data);
    mostrarEventos(data); // puedes crear esta función para mostrar datos en HTML
  })
  .catch(error => {
    console.error('Error al cargar el JSON:', error);
  });

function mostrarEventos(eventos) {
  const contenedor = document.getElementById('lista-eventos');
  eventos.forEach(evento => {
    const div = document.createElement('div');
    div.className = 'evento';
    div.innerHTML = `
      <h3>${evento.nombre}</h3>
      <p><strong>Flor:</strong> ${evento.tipoFlor}</p>
      <p><strong>Ubicación:</strong> ${evento.ubicaciones.join(', ')}</p>
      <p><strong>Temporada:</strong> ${evento.temporada}</p>
      <p><strong>Precio:</strong> ${evento.precio}</p>
      <p>${evento.descripcion}</p>
    `;
    contenedor.appendChild(div);
  });
}*/
const header = document.getElementById('header');
const home = document.getElementById('home');
const homeHeight = home.offsetHeight;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY === 0) {
    header.classList.remove('blur', 'out');
  } else if (scrollY > 0 && scrollY <= homeHeight) {
    header.classList.add('blur');
    header.classList.remove('out');
  } else if (scrollY > homeHeight) {
    header.classList.add('out');
    header.classList.remove('blur');
  }
});