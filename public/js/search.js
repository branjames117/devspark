async function searchFormHandler(event) {
  event.preventDefault();

  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const gender_identity = document.getElementById('gender_identity').value;
  const sexual_orientation =
    document.getElementById('sexual_orientation').value;

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

  if (gender_identity) {
    queryStr += `gender_identity=${gender_identity}&`;
  }

  if (sexual_orientation) {
    queryStr += `sexual_orientation=${sexual_orientation}&`;
  }

  if (skills) {
    queryStr += `skills=${skills}&`;
  }

  document.location.replace(`/results/q=${queryStr}`);
}

document
  .getElementById('search-form')
  .addEventListener('submit', searchFormHandler);
