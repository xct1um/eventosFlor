document.addEventListener('DOMContentLoaded', () => {
  const idUsuario = localStorage.getItem('idUsuario');
  if (!idUsuario) {
    alert("Sesión expirada. Por favor, inicia sesión.");
    window.location.href = "../ingresar.html";
    return;
  }

  // Navegación entre pestañas
  const botones = document.querySelectorAll('.cliente-nav-btn');
  const vistas = document.querySelectorAll('.cliente-vista');

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

  // Mostrar vista por defecto
  document.getElementById('eventos-destacados').classList.add('cliente-vista-activa');

  // Modal Editar Datos
  const modalEditar = document.getElementById("modal-editar-datos");
  const btnEditar = document.getElementById("btn-editar-datos");
  const cerrarModal = document.getElementById("cerrar-modal");
  const inputNombre = document.getElementById("input-nombre");
  const inputApellidos = document.getElementById("input-apellidos");
  const inputEmail = document.getElementById("input-email");
  const inputPassword = document.getElementById("input-password");
  const formEditar = document.getElementById("form-editar-datos");

  btnEditar.addEventListener("click", () => {
    modalEditar.style.display = "block";
    inputNombre.value = document.getElementById("nombre-usuario").textContent;
    inputApellidos.value = document.getElementById("apellidos-usuario").textContent;
    inputEmail.value = document.getElementById("email-usuario").textContent;
    inputPassword.value = document.getElementById("password-usuario").textContent;
  });

  cerrarModal.addEventListener("click", () => {
    modalEditar.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    const contenidoModal = document.querySelector(".modal-contenido");
    if (!contenidoModal.contains(e.target) && e.target === modalEditar) {
      modalEditar.style.display = "none";
    }
  });

  formEditar.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuarioActualizado = {
      idUsuario: idUsuario,
      nombre: inputNombre.value,
      apellidos: inputApellidos.value,
      email: inputEmail.value,
      password: inputPassword.value,
    };

    fetch("http://localhost:9003/usuario/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuarioActualizado)
    })
      .then(res => res.json())
      .then(resultado => {
        if (resultado === 1) {
          alert("Datos actualizados correctamente.");
          cargarDatosUsuario(idUsuario);
          modalEditar.style.display = "none";
        } else {
          alert("Error al actualizar los datos.");
        }
      })
      .catch(err => {
        console.error("Error al actualizar usuario:", err);
        alert("Error de conexión.");
      });
  });

  cargarEventos();
  cargarDatosUsuario(idUsuario);
});

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

// Función para cargar eventos destacados
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
          
          <button onclick="verEvento(${evento.id})">Más Información</button>
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(err => console.error("Error al cargar eventos:", err));
}

// Función para cargar reservas
function cargarReservas(idUsuario) {
  fetch(`http://localhost:9003/reserva/idUsuario/${idUsuario}`)
    .then(res => res.json())
    .then(reservas => {
      const contenedor = document.getElementById('reservas-usuario');
      contenedor.innerHTML = '';

      if (reservas.length === 0) {
        contenedor.innerHTML = '<p>No tienes reservas aún.</p>';
        return;
      }

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

        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = "Cancelar";
        btnCancelar.addEventListener("click", () => cancelarReserva(reserva.idReserva));
        div.appendChild(btnCancelar);

        const btnModificar = document.createElement('button');
        btnModificar.textContent = "Modificar";
        btnModificar.addEventListener("click", () => abrirModalModificacion(reserva));
        div.appendChild(btnModificar);

        contenedor.appendChild(div);
      });
    })
    .catch(err => console.error("Error al cargar reservas:", err));
}

// Modal modificación de reserva
let reservaActualId = null;

function abrirModalModificacion(reserva) {
  reservaActualId = reserva.idReserva;
  document.getElementById("cantidad").value = reserva.cantidad;
  document.getElementById("observaciones").value = reserva.observaciones || '';
  document.getElementById("modal-modificar").style.display = "block";
}

document.querySelector(".close").onclick = function () {
  document.getElementById("modal-modificar").style.display = "none";
};

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

// Función para cancelar reserva
function cancelarReserva(idReserva) {
  fetch(`http://localhost:9003/reserva/eliminar/${idReserva}`, { method: 'DELETE' })
    .then(() => {
      alert("Reserva cancelada");
      location.reload();
    })
    .catch(err => console.error("Error al cancelar reserva:", err));
}

// Función para reservar evento (placeholder)
function reservarEvento(idEvento) {
  alert(`Evento ${idEvento} reservado`);
}

// Logout
function logout() {
  localStorage.removeItem('idUsuario');
  window.location.href = "../ingresar.html";
}