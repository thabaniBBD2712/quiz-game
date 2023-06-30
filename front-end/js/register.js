document.addEventListener('DOMContentLoaded', function() {

function submitForm(event) {
  event.preventDefault();

  const usernameI = document.getElementById('username').value;
  const passwordI = document.getElementById('password').value;
  const data = {
    type: 'username-password',
    username: usernameI,
    password: passwordI
  };

  fetch('https://44.211.253.239:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
    let errorMessage = document.getElementById('error-message');
    errorMessage.innerText = "Registration Successfull";
    errorMessage.style.color = 'green';
    setTimeout(function() {

        window.location.href = "./login.html";
}, 5000); 
      } else {
        let errorMessage = document.getElementById('error-message');
    errorMessage.innerText = "Registration failed";
    errorMessage.style.color = 'red';
      }
    })
    .catch(error => {
      console.error(error);
    });
}

const form = document.getElementById('myForm');
form.addEventListener('submit', submitForm); });
