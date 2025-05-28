document.addEventListener('DOMContentLoaded', () => {
  //Recuperar ID de usuario desde localStorage
  const idUsuario = localStorage.getItem('idUsuario');

  //Si no hay ID, redirigir al login
  if (!idUsuario) {
    alert("Sesión expirada. Por favor, inicia sesión.");
    window.location.href = "../login.html"; // Ajusta la ruta si es necesario
    return;
  }

  //Navegación entre pestañas
  const botones = document.querySelectorAll('.cliente-nav-btn');
  const vistas = document.querySelectorAll('.cliente-vista');

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      vistas.forEach(v => v.classList.remove('cliente-vista-activa'));
      const targetId = boton.getAttribute('data-target');
      document.getElementById(targetId).classList.add('cliente-vista-activa');
    });
  });

  //Mostrar vista inicial por defecto
  document.getElementById('eventos-destacados').classList.add('cliente-vista-activa');

  //Cargar contenido dinámico
  cargarEventos();
  cargarDatosUsuario(idUsuario);
  cargarReservas(idUsuario); // Descomenta si estás usando reservas
});

//Función para cargar eventos destacados
function cargarEventos() {
  fetch('http://localhost:9003/evento/destacados')
    .then(res => res.json())
    .then(eventos => {
      const contenedor = document.getElementById('lista-eventos');
      contenedor.innerHTML = '';

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
    })
    .catch(err => console.error("Error al cargar eventos:", err));
}

// Función para cargar datos del usuario
function cargarDatosUsuario(idUsuario) {
  fetch(`http://localhost:9003/usuario/${idUsuario}`)
    .then(res => {
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      return res.json();
    })
    .then(usuario => {
      document.getElementById('nombre-usuario').innerText = usuario.nombre;
      document.getElementById('apellidos-usuario').innerText = usuario.apellidos;
      document.getElementById('email-usuario').innerText = usuario.email;
      document.getElementById('password-usuario').innerText = '*'.repeat(usuario.password.length);
    })
    .catch(err => console.error("Error al cargar datos del usuario:", err));
}

// Función para cargar reservas del usuario (si la usas)
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
    })
    .catch(err => console.error("Error al cargar reservas:", err));
}

// Reservar evento
function reservarEvento(idEvento) {
  alert(`Evento ${idEvento} reservado`);
  // Aquí puedes hacer un POST a tu backend si deseas realmente guardar la reserva
}

// Cancelar reserva
function cancelarReserva(idReserva) {
  fetch(`http://localhost:9003/reservas/${idReserva}`, { method: 'DELETE' })
    .then(() => {
      alert("Reserva cancelada");
      location.reload();
    })
    .catch(err => console.error("Error al cancelar reserva:", err));
}

// Modificar reserva
function modificarReserva(idReserva) {
  const nuevaCantidad = prompt("Nueva cantidad:");
  if (nuevaCantidad) {
    fetch(`http://localhost:9003/reservas/${idReserva}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: nuevaCantidad })
    })
      .then(() => {
        alert("Reserva modificada");
        location.reload();
      })
      .catch(err => console.error("Error al modificar reserva:", err));
  }
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('idUsuario');
  window.location.href = "../login.html";
}

/*
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
*/