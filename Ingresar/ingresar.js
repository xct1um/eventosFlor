document.addEventListener('DOMContentLoaded', function() {
  const signupBtn = document.getElementById('signup');
  const signinBtn = document.getElementById('signin');
  const pinkbox = document.querySelector('.pinkbox');
  const signin = document.querySelector('.signin');
  const signup = document.querySelector('.signup');

  signupBtn.addEventListener('click', function() {
    pinkbox.style.transform = 'translateX(80%)';
    signin.classList.add('nodisplay');
    signup.classList.remove('nodisplay');
  });

  signinBtn.addEventListener('click', function() {
    pinkbox.style.transform = 'translateX(0%)';
    signup.classList.add('nodisplay');
    signin.classList.remove('nodisplay');
  });

//Script de INICIO

  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); 
    //meter datos 
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    
    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(`http://localhost:9003/usuario/email/${email}/password/${password}`,{
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = "/page.html";
       
      } else {
        alert('error de email o contraseña');
      }
    } catch {
      
      alert('error de fetch');
    }
  });
  const toggle = document.querySelector('.unique-toggle');
  const tabs = document.querySelectorAll('.unique-tab');
  const clientView = document.getElementById('client-view');
  const adminView = document.getElementById('admin-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const target = this.getAttribute('data-target');
      toggle.setAttribute('data-active', target);
  
      if (target === 'client') {
        clientView.classList.remove('nodisplay');
        adminView.classList.add('nodisplay');
      } else {
        clientView.classList.add('nodisplay');
        adminView.classList.remove('nodisplay');
  
        // CORRECCIÓN CLAVE AQUÍ:
        signin.classList.remove('nodisplay');
        signup.classList.add('nodisplay');
        pinkbox.style.transform = 'translateX(0%)';
      }
  
      // Estilo de pestaña activa
      tabs.forEach(t => t.classList.remove('unique-tab-active'));
      this.classList.add('unique-tab-active');
    });
  });
});
