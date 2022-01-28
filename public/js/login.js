async function loginFormHandler(event) {
  event.preventDefault();

  const login = document.querySelector('#login').value.trim();
  const password = document.querySelector('#password').value.trim();
  errMessageEl.innerHTML = '';

  // client validation

  if (!login) {
    document.querySelector('#login').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      'Must enter either your username or your email address.<br />';
  }

  if (!password) {
    document.querySelector('#password').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Password field must not be blank.<br />';
    return;
  }

  if (password.length < 8) {
    document.querySelector('#password').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Password must be 8 characters or longer.<br />';
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
      document.location.replace(`/`);
    } else {
      errMessageEl.innerHTML =
        'Something went wrong. Are you sure the username and password are correct?<br />';
    }
  }
}

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

const errMessageEl = document.querySelector('.error-text');

document.querySelector('#login').addEventListener('input', () => {
  document.querySelector('#login').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});

document.querySelector('#password').addEventListener('input', () => {
  document.querySelector('#password').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});
