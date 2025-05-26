/*Script para hacer fetch con /todos */
async function buscar() {
  const res = await fetch(`http://localhost:9003/evento/todos`);
  const data = await res.json();
  console.log("Eventos cargados:", data);
  return data;
}
/*Imprimir JSON en pantalla */
function renderBusqueda(resultadosJSON) {
  const tabla = document.getElementById("tabla-eventos");
  tabla.innerHTML = "";

  resultadosJSON.forEach(evento => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td>${evento.idEvento}</td>
            <td>${evento.nombre}</td>
            <td>${evento.aforoMaximo}</td>
            <td>${evento.precio.toFixed(2)}</td>
            <td>${evento.estado}</td>
            <td>
                <button class="btn btn-sm btn-light border me-1" onclick="verDetalle(${evento.idEvento})")>Ver Detalle</button>
                <button class="btn btn-sm btn-light border me-1 editar-btn" data-id="${evento.idEvento}">Editar</button>
                <button class="btn btn-sm btn-light border me-1" onclick="eliminarEvento(${evento.idEvento})">Eliminar</button>
                <button class="btn btn-sm btn-light border" onclick="verReservasPorEvento(${evento.idEvento})">Ver Reservas</button>
            </td>
        `;
    tabla.appendChild(fila);
  });

  document.querySelectorAll(".editar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const evento = resultadosJSON.find(e => e.idEvento == id);
      mostrarModalEdicion(evento);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await buscar();
  renderBusqueda(data);
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fechaAlta").value = hoy;
});


/*Script para Formulario Dar de Alta*/
/*Falta agregar validaciones de campossssssssssssssssss*/
document.getElementById("DarAlta").addEventListener("submit", async function (e) {
  e.preventDefault();

  const evento = {
    nombre: document.getElementById("nombre").value,

    descripcion: document.getElementById("descripcion").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    fechaALta: document.getElementById("fechaAlta").value,
    aforoMaximo: parseInt(document.getElementById("aforoMaximo").value),
    precio: parseFloat(document.getElementById("precio").value),
    direccion: document.getElementById("direccion").value,
    duracion: parseInt(document.getElementById("duracion").value),
    unidadDuracion: document.getElementById("unidadDuracion").value,
    destacado: document.getElementById("destacado").value,
    estado: document.getElementById("estado").value,
    tipo: {
      idTipo: parseInt(document.getElementById("tipo").value)
    }
  };
  const res = await fetch("http://localhost:9003/evento/alta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    //estilo json
    body: JSON.stringify(evento)
  });
  if(res.ok){
  const data = await res.json();
  document.getElementById("mensaje").innerHTML = `<p style="color: green;">Evento creado con ID ${data.idEvento}</p>`;

  // document.getElementById("Daralta").reset();

  // 刷新页面或重新获取数据 Recargar página
  const eventos = await buscar();
  renderBusqueda(eventos);
  }
});


/*Script para ver detalle*/
async function verDetalle(idEvento) {
  const res = await fetch(`http://localhost:9003/evento/uno/${idEvento}`);
  if (res.ok) {
    const evento = await res.json();  //获取返回的数据
    //sale pantalla y los datos
    const modal =  document.getElementById("modal-detalle");
    const contenido = document.getElementById("contenido-detalle");

    contenido.innerHTML = `
      <strong>ID:</strong> ${evento.idEvento}<br>
      <strong>Nombre:</strong> ${evento.nombre}<br>
      <strong>Descripción:</strong> ${evento.descripcion}<br>
      <strong>Fecha de Inicio:</strong> ${evento.fechaInicio}<br>
      <strong>Direccion:</strong> ${evento.direccion}<br>
      <strong>Aforo Máximo:</strong> ${evento.aforoMaximo}<br>
      <strong>Precio:</strong> ${evento.precio.toFixed(2)}<br>
      <strong>Estado:</strong> ${evento.estado}
    `;
    modal.style.display = "flex";

  }
};

function cerrarModalDetalle() {
document.getElementById("modal-detalle").style.display = "none";
}


/*Script para editar*/
function mostrarModalEdicion(evento) {
  document.getElementById("modal-editar").style.display = "flex";


  // 填充数据
  document.getElementById("edit-id").value = evento.idEvento;
  document.getElementById("edit-nombre").value = evento.nombre;
  document.getElementById("edit-tipo").value = evento.tipo.idTipo;
  document.getElementById("edit-aforo").value = evento.aforoMaximo;
  document.getElementById("edit-precio").value = evento.precio;
  document.getElementById("edit-estado").value = evento.estado;
  document.getElementById("edit-destacado").value = evento.destacado;
  document.getElementById("edit-fechaInicio").value = evento.fechaInicio;
  document.getElementById("edit-duracion").value = evento.duracion;
  document.getElementById("edit-unidadDuracion").value = evento.unidadDuracion;
  document.getElementById("edit-direccion").value = evento.direccion;
  document.getElementById("edit-descripcion").value = evento.descripcion;
  
}


// 关闭弹窗
document.getElementById("cancelar-edicion").addEventListener("click", () => {
  document.getElementById("modal-editar").style.display = "none";
});


// 提交编辑表单
document.getElementById("formEditar").addEventListener("submit", async function (e) {
  e.preventDefault();


  const idEvento = document.getElementById("edit-id").value;
  const evento = {
    idEvento: parseInt(idEvento),
    nombre: document.getElementById("edit-nombre").value,
    descripcion: document.getElementById("edit-descripcion").value,
    fechaInicio: document.getElementById("edit-fechaInicio").value,
    aforoMaximo: parseInt(document.getElementById("edit-aforo").value),
    precio: parseFloat(document.getElementById("edit-precio").value),
    direccion: document.getElementById("edit-direccion").value,
    duracion: parseInt(document.getElementById("edit-duracion").value),
    unidadDuracion: document.getElementById("edit-unidadDuracion").value,
    destacado: document.getElementById("edit-destacado").value,
    estado: document.getElementById("edit-estado").value,
    tipo: {
      idTipo: parseInt(document.getElementById("edit-tipo").value)
    }
  };


  const res = await fetch(`http://localhost:9003/evento/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(evento)
  });


  if (res.ok) {
    // 关闭弹窗并刷新页面数据
    document.getElementById("modal-editar").style.display = "none";
   
    const eventos = await buscar();//再次从后端获取最新列表
      renderBusqueda(eventos);//显示在页面上
     
    //location.reload(); // 或者重新调用 buscar() + renderBusqueda()
   
  } else {
    alert("Error al actualizar el evento.");
  }
});


/* Script para Eliminar */
async function eliminarEvento(idEvento) {
  const res = await fetch(`http://localhost:9003/evento/eliminar/${idEvento}`, {
    method: "DELETE",
  });

  // Verificamos si la respuesta fue exitosa
  if (res.ok) {
      const result = await res.json(); // Obtener el JSON de la respuesta

      // Si la respuesta indica éxito, mostramos el mensaje de eliminación
      if (result === 1) {
          const modal = document.getElementById("modal-Eliminar");
          const contenido = document.getElementById("contenido-eliminar");
          contenido.innerHTML = `ID <strong>${idEvento}</strong> eliminado exitosamente. <br>`;
          modal.style.display = "flex";

          // Refrescamos la lista de eventos
          const eventos = await buscar();
          renderBusqueda(eventos);

      } else if (result === 0) {
          // Si no se puede eliminar por la reserva, mostramos el mensaje de error
          alert("No se puede eliminar, porque tiene una reserva.");
      } else {
          // Si hubo algún otro error
          alert("Hubo un error al intentar eliminar el evento.");
      }
  } 
}


function AceptoModalEliminar() {
  document.getElementById("modal-Eliminar").style.display = "none";
  }

/*Script para ver Reservas por Evento */

function verReservasPorEvento(idEvento) {
  fetch(`http://localhost:9003/reserva/evento/${idEvento}`)
      .then(response => {
          if (!response.ok) {
              throw new Error("Error al cargar reservas");
          }
          return response.json();
      })
      .then(reservas => {
          mostrarReservasEnModal(reservas);
          abrirModalReservas();
      })
      .catch(error => {
          console.error("Error al obtener las reservas del evento:", error);
          document.getElementById("contenido-reservas").innerHTML = "<p>Error al cargar reservas.</p>";
          abrirModalReservas();
      });
}

function mostrarReservasEnModal(reservas) {
  const contenedor = document.getElementById("contenido-reservas");
  contenedor.innerHTML = "";

  if (reservas.length === 0) {
      contenedor.innerHTML = "<p>No hay reservas para este evento.</p>";
      return;
  }

  const tabla = document.createElement("table");
  tabla.classList.add("table", "table-striped");
  tabla.innerHTML = `
      <thead>
          <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Cantidad</th>
              <th>Precio Venta</th>
              <th>Observaciones</th>
          </tr>
      </thead>
      <tbody>
          ${reservas.map(r => `
              <tr>
                  <td>${r.idReserva}</td>
                  <td>${r.usuario.nombre}</td>
                  <td>${r.cantidad}</td>
                  <td>${r.precioVenta} €</td>
                  <td>${r.observaciones || ""}</td>
              </tr>
          `).join("")}
      </tbody>
  `;
  contenedor.appendChild(tabla);
}

function abrirModalReservas() {
  document.getElementById("modal-reservas").style.display = "flex";
}

function cerrarModalReservas() {
  document.getElementById("modal-reservas").style.display = "none";
}
/*Script Cerrar Sesión*/
function cerrar(){
  /*const res = await fetch(`http://localhost:9003/usuario/cerrar`,{
    method: "POST",
  });*/
  localStorage.removeItem('admin');
  window.location.href = 'proyecto.html';
}

//Script de REGISTRO
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // 阻止表单默认提交行为


    // 获取表单输入值
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;



    // 构造发送的数据对象
    const data = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        password: password
    };

    try {
        const res = await fetch('http://localhost:9003/usuario/alta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert('Error: ' + (errorData.message || res.statusText));
            return;
        }

        const result = await res.json();
        alert('Ya esta registrado');
        window.location.href = "page.html";
        // 这里可以重置表单或者跳转页面
        this.reset();

    } catch (error) {
        alert('Request failed: ' + error.message);
    }
});


