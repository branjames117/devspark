// function to asynchronously find all users github repos with issues and display on homepage
async function githubStarred() {
  // user will be userID for github
  const user = document.getElementById('github').textContent.trim();
  const repoContainerEl = document.querySelector('#repoContainerEl');

  const apiUrl = `https://api.github.com/users/${user}/starred?`;
  // grab users public github repo data
  const response = await fetch(apiUrl);

  if (response.ok) {
    const data = await response.json();
    displayRepos = (repos) => {
      for (let i = 0; i < repos.length; i++) {
        const repoName = repos[i].name;

        var repoEl = document.createElement('a');
        repoEl.setAttribute(
          'href',
          'https://github.com/' + user + '/' + repoName
        );
        // https://github.com/Cody-Junier/u-develop-it
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        repoEl.appendChild(titleEl);

        var statusEl = document.createElement('span');

        statusEl.innerHTML =
          '<p>Open Issues ' + repos[i].open_issues_count + '</p>';

        repoEl.appendChild(statusEl);
        repoContainerEl.appendChild(repoEl);
      }
    };
    displayRepos(data);
  }
}

githubStarred();
