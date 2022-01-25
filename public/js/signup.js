async function signupFormHandler(e) {
  e.preventDefault();

  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const confirm = document.querySelector('#confirm-signup').value.trim();
  const username = document.querySelector('#username-login').value;


  if (username.includes(' ')) {
    document.querySelector('#username-login').style.borderColor = 'red';
    errMessageEl.textContent = 'Username field must not contain spaces.';
    return;
  }
  // user validation
  if (!email) {
    document.querySelector('#email-signup').style.borderColor = 'red';
    errMessageEl.textContent = 'Email field must not be blank.';
    return;
  }

  if (email.length > 30) {
    document.querySelector('#email-signup').style.borderColor = 'red';
    errMessageEl.textContent = 'Email cannot exceed 30 characters in length.';
    return;
  }

  if (!username) {
    document.querySelector('#username-login').style.borderColor = 'red';
    errMessageEl.textContent = 'Username field must not be blank.';
  }

  if (!password) {
    document.querySelector('#password-signup').style.borderColor = 'red';
    errMessageEl.textContent = 'Password field must not be blank.';
    return;
  }

  if (password.length < 8) {
    document.querySelector('#password-signup').style.borderColor = 'red';
    errMessageEl.textContent =
      'Password must be at least 8 characters in length.';
    return;
  }

  if (!confirm) {
    document.querySelector('#confirm-signup').style.borderColor = 'red';
    errMessageEl.textContent = 'Confirm Password field must not be blank.';
    return;
  }

  const matchPasswords = password === confirm;

  if (!matchPasswords) {
    document.querySelector('#confirm-signup').style.borderColor = 'red';
    errMessageEl.textContent =
      'Password and Confirm Password fields do not match.';
    return;
  }

  if (email && username && matchPasswords) {
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({ email, username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/profile/editor');
    } else {
      errMessageEl.textContent =
        'Something went wrong. Try a different username or email address.';
    }
  }
}

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);

const errMessageEl = document.querySelector('.error-text');

document.querySelector('#email-signup').addEventListener('input', () => {
  document.querySelector('#email-signup').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});

document.querySelector('#password-signup').addEventListener('input', () => {
  document.querySelector('#password-signup').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});

document.querySelector('#confirm-signup').addEventListener('input', () => {
  document.querySelector('#confirm-signup').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});
