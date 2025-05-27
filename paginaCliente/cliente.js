document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.cliente-nav-btn');
    const vistas = document.querySelectorAll('.cliente-vista');
  
    botones.forEach(boton => {
      boton.addEventListener('click', () => {
        vistas.forEach(v => v.classList.remove('cliente-vista-activa'));
        const targetId = boton.getAttribute('data-target');
        document.getElementById(targetId).classList.add('cliente-vista-activa');
      });
    });
  
    // Aquí podrías cargar los datos del usuario y reservas desde el backend
    // fetch('/usuario/info').then(...);
    // fetch('/reserva/cliente/{id}').then(...);
  });