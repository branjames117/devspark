async function searchFormHandler(event) {
  event.preventDefault();

  const city = document.getElementById('city').value;

  const state = document.getElementById('state').value;

  let skills = '';
  for (let i = 1; i <= 26; i++) {
    if (document.getElementById('skill' + i).checked) skills += i + ';';
  }

  console.log(skills);

  let queryStr = '?';
  if (city) {
    queryStr += `city=${city}&`;
  }

  if (state) {
    queryStr += `state=${state}&`;
  }

  if (skills) {
    queryStr += `skills=${skills}&`;
  }

  document.location.replace(`/results/q=${queryStr}`);
}

document
  .getElementById('search-form')
  .addEventListener('submit', searchFormHandler);
