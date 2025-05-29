let idEvento = 0;

// Obtener los parámetros de la URL actual
const parametros = new URLSearchParams(window.location.search);

// Obtener el valor del parámetro "idEvento"
if (parametros.has('idEvento')) {
    idEvento = parametros.get('idEvento');
} else {
    alert("No se encontró el ID del evento.");
}
console.log("Cargando evento con idEvento:", idEvento);
// Cargar detalles del evento
function cargarEvento(idEvento) {
    fetch(`http://localhost:9003/evento/uno/${idEvento}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener el evento");
            return res.json();
        })
        .then(evento => {
            document.getElementById("eventoNombre").textContent = evento.nombre || 'Sin nombre';
            document.getElementById("eventoDescripcion").textContent = evento.descripcion || 'Sin descripción';
            document.getElementById("eventoFechaInicio").textContent = evento.fechaInicio || 'Sin fecha';
            document.getElementById("eventoUnidadDuracion").textContent = evento.unidadDuracion || 'meses';
            document.getElementById("eventoDuracion").textContent = evento.duracion || '0';
            document.getElementById("eventoDireccion").textContent = evento.direccion || 'No especificada';
            document.getElementById("eventoAforo").textContent = evento.aforoMaximo || 'No definido';
            document.getElementById("eventoPrecio").textContent = evento.precio?.toFixed(2) || '0.00';
            document.getElementById("eventoTipo").textContent = evento.tipo?.nombre || 'Sin tipo';

            // Imagen principal si está presente
            const img = document.getElementById("imgPrincipalEvento");
            if (img && evento.imagenPrincipal) {
                img.src = evento.imagenPrincipal;
            }
        })
        .catch(err => {
            console.error("Error al cargar el evento:", err);
            alert("No se pudo cargar la información del evento.");
        });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarEvento(idEvento);
});

document.getElementById('btnReservar').addEventListener('click', function () {
    // Simulamos datos de reserva, deberías reemplazar con valores reales
    const reserva = {
        idEvento: idEvento,
        idUsuario: idUsuario
    };

    fetch('http://localhost:9003/reserva/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Usted ya se encuentra registrado en el evento. ¡Gracias!');
            }
            return response.json();
        })
        .then(data => {
            alert('¡Reserva realizada con éxito!');
            console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al hacer la reserva');
        });
});