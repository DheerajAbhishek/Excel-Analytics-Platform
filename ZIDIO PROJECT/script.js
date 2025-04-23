document.getElementById('signup-form').addEventListener('submit', async function (e) {
       e.preventDefault();
       
       const username = document.getElementById('signup-username').value;
       const email = document.getElementById('signup-email').value;
       const password = document.getElementById('signup-password').value;

       const response = await fetch('http://your-backend-url/api/signup', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({ username, email, password }),
       });

       const data = await response