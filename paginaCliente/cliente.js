const idUsuario = 1;
document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.cliente-nav-btn');
  const vistas = document.querySelectorAll('.cliente-vista');
 

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      // Ocultar todas las vistas
      vistas.forEach(v => v.classList.remove('cliente-vista-activa'));

      // Mostrar la vista correspondiente al botón clicado
      const targetId = boton.getAttribute('data-target');
      document.getElementById(targetId).classList.add('cliente-vista-activa');
    });
  });

  // Mostrar eventos destacados por defecto al cargar la página
  document.getElementById('eventos-destacados').classList.add('cliente-vista-activa');

  cargarEventos();
  cargarDatosUsuario(idUsuario);
  cargarReservas(idUsuario);
});

function cargarEventos() {
  fetch('http://localhost:9003/evento/destacados')
    .then(res => res.json())
    .then(eventos => {
      const contenedor = document.getElementById('lista-eventos');
      contenedor.innerHTML = ''; // limpia el contenedor antes de agregar

      eventos.forEach(evento => {
        const div = document.createElement('div');
        div.classList.add('evento');
        div.innerHTML = `
          <h3>${evento.nombre}</h3>
          <p>${evento.descripcion}</p>
          <button onclick="reservarEvento(${evento.id})">Reservar</button>
        `;
        contenedor.appendChild(div);
      });
    });
}
function cargarDatosUsuario(idUsuario) {
  fetch(`http://localhost:9003/usuario/${idUsuario}`)
    .then(res => {
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      return res.json();
    })
    .then(usuario => {
      console.log("Usuario recibido:", usuario); // 👈 debug
      const contenedor = document.getElementById('datos-usuario-card');
      contenedor.innerHTML = `
        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
        <p><strong>Apellido:</strong> ${usuario.apellidos}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Contraseña:</strong> ${'*'.repeat(usuario.password.length)}</p>
      `;
    })
    .catch(err => console.error("Error al cargar datos del usuario:", err));
}
function cargarReservas(idUsuario) {
  fetch(`http://localhost:9003/reservas/usuario/${idUsuario}`)
    .then(res => res.json())
    .then(reservas => {
      const contenedor = document.getElementById('reservas-usuario');
      contenedor.innerHTML = '';
      reservas.forEach(reserva => {
        const div = document.createElement('div');
        div.classList.add('reserva');
        div.innerHTML = `
          <h4>${reserva.eventoNombre}</h4>
          <p>Cantidad: ${reserva.cantidad}</p>
          <button onclick="cancelarReserva(${reserva.id})">Cancelar</button>
          <button onclick="modificarReserva(${reserva.id})">Modificar</button>
        `;
        contenedor.appendChild(div);
      });
    });
}

function reservarEvento(idEvento) {
  alert(`Evento ${idEvento} reservado`);
}

function cancelarReserva(idReserva) {
  fetch(`http://localhost:9003/reservas/${idReserva}`, { method: 'DELETE' })
    .then(() => {
      alert("Reserva cancelada");
      location.reload();
    });
}

function modificarReserva(idReserva) {
  const nuevaCantidad = prompt("Nueva cantidad:");
  if (nuevaCantidad) {
    fetch(`http://localhost:9003/reservas/${idReserva}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: nuevaCantidad })
    }).then(() => {
      alert("Reserva modificada");
      location.reload();
    });
  }
}
