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
});



//Script de INICIO
document.addEventListener('DOMContentLoaded', function () {
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
});
