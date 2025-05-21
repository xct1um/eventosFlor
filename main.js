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
                <button class="btn btn-sm btn-light border me-1" )">Editar</button>
                <button class="btn btn-sm btn-light border me-1" onclick="eliminarEvento(${evento.idEvento})">Eliminar</button>
                <button class="btn btn-sm btn-light border">Ver Reservas</button>
            </td>
        `;
    tabla.appendChild(fila);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await buscar();
  renderBusqueda(data);
});



/*Script para comportamiento de Header*/
/*const header = document.getElementById('header');
const home = document.getElementById('home');
const homeHeight = home.offsetHeight; //error

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
});*/


/*Script para Formulario Dar de Alta*/
document.getElementById("DarAlta").addEventListener("submit", async function (e) {
  e.preventDefault();

  const evento = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    //fechaAlta: document.getElementById("fechaAlta").now,
    aforoMaximo: parseInt(document.getElementById("aforoMaximo").value),
    precio: parseFloat(document.getElementById("precio").value),
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

  const data = await res.json();
  document.getElementById("mensaje").innerHTML = `<p style="color: green;">Evento creado con ID ${data.idEvento}</p>`;

  // document.getElementById("formEvento").reset();

  // 刷新页面或重新获取数据
  const eventos = await buscar();
  renderBusqueda(eventos);
});

/*Script para Eliminar*/
async function eliminarEvento(idEvento) {
    const res = await fetch(`http://localhost:9003/evento/eliminar/${idEvento}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert(`Evento ${idEvento} eliminado exitosamente.`);

      // 刷新页面或重新获取数据
      const eventos = await buscar();
      renderBusqueda(eventos);
    } 
};

/*Script para ver datalle*/
async function verDetalle(idEvento) {
    const res = await fetch(`http://localhost:9003/evento/uno/${idEvento}`);
    if (res.ok) {
      const evento = await res.json();  //获取返回的数据
      //sale pantalla y los datos
      alert(`ID: ${evento.idEvento}\nNombre: ${evento.nombre}\nDescripción: ${evento.descripcion}\nFecha de Inicio: ${evento.fechaInicio}\nAforo Máximo: ${evento.aforoMaximo}\nPrecio: ${evento.precio.toFixed(2)}\nEstado: ${evento.estado}`);

    }
};

/*Script para editar*/

/**/

/** */


