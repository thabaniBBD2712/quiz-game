document.addEventListener('DOMContentLoaded', function() {
  function submitForm(event) {
      event.preventDefault();
      const usernameI = document.getElementById('username').value;
      const passwordI = document.getElementById('password').value;
    
      const loginObject = {
        from: 'username-password',
        to: 'bearer',
        username: usernameI,
        password: passwordI
     };

      fetch('https://44.211.253.239:3000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginObject)
}).then(data => {
    if (data.ok) {
        window.location.href = "./quiz.html";
        return data.json();
    } else {
        let errorMessage = document.getElementById('error-message');
        errorMessage.innerText = "Invalid username or password";
        errorMessage.style.color = 'red';
    }
    
})
  .then(response => {
    localStorage.setItem("awt", response.token);   
  })
  .catch(error => {
    console.error(error);
  });
    }
    const form = document.getElementById('myForm');
    form.addEventListener('submit', submitForm);
});