async function forgotPasswordFormHandler(e) {
  e.preventDefault();
  console.log('form submitted');

  const email = document.querySelector('#email').value.trim();
  // user validation
  if (!email) {
    document.getElementById('email').style.borderColor = '#ccc';
    errMessageEl.innerHTML += 'Email field must not be blank.<br />';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    document.getElementById('email').style.borderColor = '#ccc';
    errMessageEl.innerHTML += 'Email must contain @ and . characters.<br />';
    return;
  }

  const response = await fetch('/api/users/forgot', {
    method: 'post',
    body: JSON.stringify({ email }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    errMessageEl.innerHTML =
      'Your request has been submitted! Please check your email for your Reset Password link.<br />';
  } else {
    errMessageEl.innerHTML =
      'Something went wrong! Please try again later.<br />';
  }
}

document
  .getElementById('forgot-password-form')
  .addEventListener('submit', forgotPasswordFormHandler);

const errMessageEl = document.querySelector('.error-text');

document.getElementById('email').addEventListener('input', () => {
  document.getElementById('email').style.borderColor = '#ccc';
  errMessageEl.textContent = '';
});
