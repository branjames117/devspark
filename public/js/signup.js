async function signupFormHandler(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value.trim();
  const confirm = document.getElementById('confirm').value.trim();

  let regex = /[^A-Za-z0-9]+/;

  if (username.includes(' ')) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Username field must not contain spaces.</li>';
    return;
  }

  if (regex.test(username)) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Username field must not contain special characters.</li>';
    return;
  }

  if (username.length > 14) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Username cannot be longer than 14 characters.</li>';
    return;
  }

  // user validation
  if (!email) {
    document.getElementById('email').style.borderColor = 'red';
    errMessageEl.innerHTML += '<li>Email field must not be blank.</li>';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    document.getElementById('email').style.borderColor = 'red';
    errMessageEl.innerHTML += '<li>Email must contain @ and . characters.</li>';
    return;
  }

  if (email.length > 40) {
    document.getElementById('email').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Email address cannot be longer than 40 characters.</li>';
    return;
  }

  if (!username) {
    document.getElementById('username').style.borderColor = 'red';
    errMessageEl.innerHTML += '<li>Username field must not be blank.</li>';
  }

  if (!password) {
    document.getElementById('password').style.borderColor = 'red';
    errMessageEl.innerHTML += '<li>Password field must not be blank.</li>';
    return;
  }

  if (password.length < 8) {
    document.getElementById('password').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Password must be at least 8 characters in length.</li>';
    return;
  }

  if (password.length > 40) {
    document.getElementById('email').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Password cannot be longer than 40 characters.</li>';
    return;
  }

  if (!confirm) {
    document.getElementById('confirm').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Confirm Password field must not be blank.</li>';
    return;
  }

  const matchPasswords = password === confirm;

  if (!matchPasswords) {
    document.getElementById('confirm').style.borderColor = 'red';
    errMessageEl.innerHTML +=
      '<li>Password and Confirm Password fields do not match.</li>';
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
        '<li>Something went wrong. Try a different username or email address.</li>';
    }
  }
}

document
  .getElementById('signup-form')
  .addEventListener('submit', signupFormHandler);

const errMessageEl = document.querySelector('.error-text');

document.getElementById('email').addEventListener('input', () => {
  document.getElementById('email').style.borderColor = '#ccc';
  errMessageEl.innerHTML = '';
});

document.getElementById('username').addEventListener('input', () => {
  document.getElementById('username').style.borderColor = '#ccc';
  errMessageEl.innerHTML = '';
});

document.getElementById('password').addEventListener('input', () => {
  document.getElementById('password').style.borderColor = '#ccc';
  errMessageEl.innerHTML = '';
});

document.getElementById('confirm').addEventListener('input', () => {
  document.getElementById('confirm').style.borderColor = '#ccc';
  errMessageEl.innerHTML = '';
});
