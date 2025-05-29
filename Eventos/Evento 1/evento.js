document.querySelector('.btn').addEventListener('click', () => {
    alert('Redirigiendo a la página de reservas...');
    // Aquí puedes agregar la lógica para redirigir o mostrar un modal de reserva
  });
  document.getElementById('btnReservar').addEventListener('click', function () {
    // Simulamos datos de reserva, deberías reemplazar con valores reales
    const reserva = {
        idEvento: 1,
        idUsuario: 5,
        fechaReserva: new Date().toISOString().split('T')[0],
        cantidad: 2
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
            throw new Error('Error en la reserva');
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