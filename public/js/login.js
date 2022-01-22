async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  // client validation
  if (!email) {
    document.querySelector('#email-login').style.borderColor = 'red';
    errMessageEl.textContent = 'Email field must not be blank.';
    return;
  }

  if (!password) {
    document.querySelector('#password-login').style.borderColor = 'red';
    errMessageEl.textContent = 'Password field must not be blank.';
    return;
  }

  if (password.length < 8) {
    document.querySelector('#password-login').style.borderColor = 'red';
    errMessageEl.textContent = 'Password must be 8 characters or longer.';
    return;
  }

  // last client validation check
  if (email && password) {
    // post request to /api/users to create a user
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/home');
    } else {
      errMessageEl.textContent =
        'Something went wrong. Are you sure the username and password are correct?';
    }
  }
}

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

const errMessageEl = document.querySelector('.error-text');

document.querySelector('#email-login').addEventListener('input', () => {
  document.querySelector('#email-login').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});

document.querySelector('#password-login').addEventListener('input', () => {
  document.querySelector('#password-login').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});
