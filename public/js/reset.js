async function resetPasswordHandler(event) {
  event.preventDefault();

  const password = document.querySelector('#password').value.trim();

  const confirmPassword = document
    .querySelector('#confirm-password')
    .value.trim();

  // client side validation
  if (password !== confirmPassword) {
    document.querySelector('#password').style.borderColor = 'red';
    document.querySelector('#confirm-password').value.trim();

    errMessageEl.textContent = 'Passwords do not match.';
  }
}
