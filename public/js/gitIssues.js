// function to asynchronously find all users github repos with issues and display on homepage
async function githubIssues(user){
    // user will be userID for github
    const user = document.querySelector("#githubusername").value;
    const apiUrl = "https://api.github.com/users/" + user +"/starred";
    // grab users public github repo data
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // function to show repos w/ issues, not declared as of yet
                // perhaps us handlebars.js to display repos?
                displayRepos =() =>{
                    for (let i = 0; i < repos.length; i++) {
                        const repoName = repos[i].name;

                        var repoEl = document.createElement("a");
                        repoEl.classList= "list-item flex-row justify-space-between align-center";
                        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

                        var titleEl= document.createElement("span");
                        titleEl.textContent= repoName;

                        repoEl.appendChild(titleEl);

                        var statusEl = document.createElement("span");
                        statusEl.classList="flex-row align-center";

                        if (repos[i].open_issues_count > 0){
                            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" +repos[i].open_issues_count + " issue(s)";

                        }else{
                            statusEl.innerHTML= "<i class='fas fa-check-square status-icon icon-success'></i>";
                        }
                        repoEl.appendChild(statusEl);
                        repoContainerEl.appendChild(repoEl);
                    }
                };
            })
        }else{
            console.log("Github User not found");
        }
    })
    .catch(function(error){
        console.log("Github is Unavailable at this time")
    })
}