document.addEventListener('DOMContentLoaded', () => {
  //Recuperar ID de usuario desde localStorage
  const idUsuario = localStorage.getItem('idUsuario');

  //Si no hay ID, redirigir al login
  if (!idUsuario) {
    alert("Sesión expirada. Por favor, inicia sesión.");
    window.location.href = "../ingresar.html"; // Ajusta la ruta si es necesario
    return;
  }

  //Navegación entre pestañas
  const botones = document.querySelectorAll('.cliente-nav-btn');
  const vistas = document.querySelectorAll('.cliente-vista');

  // Navegación entre pestañas
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      vistas.forEach(v => v.classList.remove('cliente-vista-activa'));
      const targetId = boton.getAttribute('data-target');
      document.getElementById(targetId).classList.add('cliente-vista-activa');

      if (targetId === 'cliente-mis-reservas') {
        cargarReservas(idUsuario);
      }
    });
  });


  //Mostrar vista inicial por defecto
  document.getElementById('eventos-destacados').classList.add('cliente-vista-activa');
  document.getElementById('btn-editar-datos').addEventListener('click', () => {
    // Mostrar formulario
    document.getElementById('form-editar-datos').style.display = 'block';

    // Rellenar campos con los datos actuales
    document.getElementById('input-nombre').value = document.getElementById('nombre-usuario').innerText;
    document.getElementById('input-apellidos').value = document.getElementById('apellidos-usuario').innerText;
    document.getElementById('input-email').value = document.getElementById('email-usuario').innerText;
  });
  //Cargar contenido dinámico
  cargarEventos();
  cargarDatosUsuario(idUsuario);
  //cargarReservas(idUsuario); // Descomenta si estás usando reservas
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
          <button onclick="reservarEvento(${evento.id})">Más Información</button>
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

function cargarReservas(idUsuario) {
  fetch(`http://localhost:9003/reserva/idUsuario/${idUsuario}`)
    .then(res => res.json())
    .then(reservas => {
      const contenedor = document.getElementById('reservas-usuario');
      contenedor.innerHTML = '';

      // ✅ Si no hay reservas, mostrar mensaje y salir
      if (reservas.length === 0) {
        contenedor.innerHTML = '<p>No tienes reservas aún.</p>';
        return;
      }

      // 🧩 Si hay reservas, renderizarlas
      reservas.forEach(reserva => {
        const div = document.createElement('div');
        div.classList.add('reserva');

        div.innerHTML = `
          <h4>${reserva.nombreEvento}</h4>
          <p><strong>Fecha:</strong> No disponible</p>
          <p><strong>Cantidad:</strong> ${reserva.cantidad}</p>
          <p><strong>Precio por entrada:</strong> ${reserva.precioEvento} €</p>
          <p><strong>Total:</strong> ${reserva.precioEvento * reserva.cantidad} €</p>
          <p><strong>Observaciones:</strong> ${reserva.observaciones || 'Ninguna'}</p>
        `;

        // Botón Cancelar
        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = "Cancelar";
        btnCancelar.addEventListener("click", () => cancelarReserva(reserva.idReserva));
        div.appendChild(btnCancelar);

        // Botón Modificar
        const btnModificar = document.createElement('button');
        btnModificar.textContent = "Modificar";
        btnModificar.addEventListener("click", () => abrirModalModificacion(reserva));
        div.appendChild(btnModificar);

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
  fetch(`http://localhost:9003/reserva/eliminar/${idReserva}`, { method: 'DELETE' })
    .then(() => {
      alert("Reserva cancelada");
      location.reload();
    })
    .catch(err => console.error("Error al cancelar reserva:", err));
}

// Modificar reserva
function modificarReserva() {
  const nuevaCantidad = prompt("Nueva cantidad:");
  if (nuevaCantidad) {
    fetch(`http://localhost:9003/reserva/update`, {
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
  window.location.href = "../ingresar.html";
}
let reservaActualId = null;

// Abrir el modal y rellenar los datos actuales
function abrirModalModificacion(reserva) {
  reservaActualId = reserva.idReserva;
  document.getElementById("cantidad").value = reserva.cantidad;
  document.getElementById("observaciones").value = reserva.observaciones || '';
  document.getElementById("modal-modificar").style.display = "block";
}

// Cerrar el modal
document.querySelector(".close").onclick = function () {
  document.getElementById("modal-modificar").style.display = "none";
};

// Al enviar el formulario
document.getElementById("form-modificar").addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevaCantidad = document.getElementById("cantidad").value;
  const nuevasObservaciones = document.getElementById("observaciones").value;

  fetch("http://localhost:9003/reserva/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idReserva: reservaActualId,
      cantidad: parseInt(nuevaCantidad),
      observaciones: nuevasObservaciones
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Error en la solicitud");
      alert("Reserva modificada correctamente");
      location.reload();
    })
    .catch(err => {
      console.error("Error al modificar reserva:", err);
      alert("Hubo un error al modificar la reserva.");
    });


});


