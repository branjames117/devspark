async function signupFormHandler(e) {
  e.preventDefault();

  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const confirm = document.querySelector('#confirm-signup').value.trim();
  const username = document.querySelector('#username-login').value;
  let regex = /[^A-Za-z0-9]+/;

  if (username.includes(' ')) {
    document.querySelector('#username-login').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Username field must not contain spaces.<br />';
    return;
  }

  if (regex.test(username)) {
    document.querySelector('#username-login').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      'Username field must not contain special characters.<br />';
    return;
  }

  // user validation
  if (!email) {
    document.querySelector('#email-signup').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Email field must not be blank.<br />';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    document.querySelector('#email-signup').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Email must contain @ and . characters.<br />';
    return;
  }

  if (!username) {
    document.querySelector('#username-login').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Username field must not be blank.<br />';
  }

  if (!password) {
    document.querySelector('#password-signup').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Password field must not be blank.<br />';
    return;
  }

  if (password.length < 8) {
    document.querySelector('#password-signup').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      'Password must be at least 8 characters in length.<br />';
    return;
  }

  if (!confirm) {
    document.querySelector('#confirm-signup').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Confirm Password field must not be blank.<br />';
    return;
  }

  const matchPasswords = password === confirm;

  if (!matchPasswords) {
    document.querySelector('#confirm-signup').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      'Password and Confirm Password fields do not match.<br />';
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
      errMessageEl.innerHTML =
        'Something went wrong. Try a different username or email address.<br />';
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
