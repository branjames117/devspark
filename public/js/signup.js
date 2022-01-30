async function signupFormHandler(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value.trim();
  const confirm = document.getElementById('confirm').value.trim();

  let regex = /[^A-Za-z0-9]+/;

  if (username.includes(' ')) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Username field must not contain spaces.<br />';
    return;
  }

  if (regex.test(username)) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      'Username field must not contain special characters.<br />';
    return;
  }

  // user validation
  if (!email) {
    document.getElementById('email').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Email field must not be blank.<br />';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    document.getElementById('email').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Email must contain @ and . characters.<br />';
    return;
  }

  if (!username) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Username field must not be blank.<br />';
  }

  if (!password) {
    document.getElementById('password').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Password field must not be blank.<br />';
    return;
  }

  if (password.length < 8) {
    document.getElementById('password').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      'Password must be at least 8 characters in length.<br />';
    return;
  }

  if (!confirm) {
    document.getElementById('confirm').style.borderColor = 'red';
    errMessageEl.innerHTML += 'Confirm Password field must not be blank.<br />';
    return;
  }

  const matchPasswords = password === confirm;

  if (!matchPasswords) {
    document.getElementById('confirm').style.borderColor = 'red';
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

document.getElementById('email').addEventListener('input', () => {
  document.getElementById('email').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});

document.getElementById('password').addEventListener('input', () => {
  document.getElementById('password').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});

document.querySelector('#confirm-signup').addEventListener('input', () => {
  document.querySelector('#confirm-signup').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});
