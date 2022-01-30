async function loginFormHandler(event) {
  event.preventDefault();

  const login = document.querySelector('#login').value.trim();
  const password = document.querySelector('#password').value.trim();
  errMessageEl.innerHTML = '';

  // client validation

  if (!login) {
    document.querySelector('#login').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Must enter either your username or your email address.</li>';
  }

  if (!password) {
    document.querySelector('#password').style.borderColor = 'red';
    errMessageEl.innerHTML += '<li>Password field must not be blank.</li>';
    return;
  }

  if (password.length < 8) {
    document.querySelector('#password').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Password must be 8 characters or longer.</li>';
    return;
  }

  // last client validation check
  if (login && password) {
    // post request to /api/users to create a user
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        login,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      document.location.replace(`/chat/`);
    } else {
      errMessageEl.innerHTML =
        '<li>Something went wrong. Are you sure the username and password are correct?</li>';
    }
  }
}

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

const errMessageEl = document.querySelector('.error-text');

document.getElementById('login').addEventListener('input', () => {
  document.getElementById('login').style.borderColor = '#ccc';
  errMessageEl.innerHTML = '';
});

document.querySelector('#password').addEventListener('input', () => {
  document.querySelector('#password').style.borderColor = '#ccc';
  errMessageEl.innerHTML = '';
});
