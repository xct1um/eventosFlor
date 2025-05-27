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

//script de registro

document.getElementById('registerForm').addEventListener('submit', async function(event) {
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

    if (res.ok) {
      const result = await res.json();
      alert('Ya esta registrado');
      
      window.location.href = "paginaCliente/page.html"//este no sunciona
     // this.reset();
    }

    const errorData = await res.json();
      alert('Error: ' + (errorData.message || res.statusText));
      return;

  } catch (error) {
    alert('Request failed: ' + error.message);
  }
});


//Script de INICIO
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    //meter datos 
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
  
      const response = await fetch(`http://localhost:9003/usuario/email/${email}/password/${password}`,{
        headers: {
        'Content-Type': 'application/json'
      }
      });

      if (response.ok) {
        const result = await response.json();
        if(result === 0){
          alert('error de email o contraseña, pruebas otra');
          
        }else {
          window.location.href = "paginaCliente/page.html";
        }
      } 
    
  });
});
