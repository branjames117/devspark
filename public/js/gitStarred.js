// function to asynchronously find all users github repos with issues and display on homepage
async function githubStarred(){
    // user will be userID for github
    const user = document.querySelector("#githubusername").textContent.trim();
    const repoContainerEl = document.querySelector("#repoContainerEl");
    console.log(user)
    const apiUrl = `https://api.github.com/users/${user}/starred?`;
    // grab users public github repo data
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // function to show repos w/ issues, not declared as of yet
                // perhaps us handlebars.js to display repos?
                console.log(data)
                displayRepos =(repos) =>{
                    for (let i = 0; i < repos.length; i++) {
                        const repoName = repos[i].name;

                        var repoEl = document.createElement("a");
                        repoEl.classList= "list-item flex-row justify-space-between align-center";
                        repoEl.setAttribute("href", "https://github.com/" + user + "/" +repoName);
                        // https://github.com/Cody-Junier/u-develop-it
                        var titleEl= document.createElement("span");
                        titleEl.textContent= repoName;

                        repoEl.appendChild(titleEl);

                        var statusEl = document.createElement("span");
                        statusEl.classList="flex-row align-center";

                      statusEl.innerHTML = "<p class='fas fa-t[mes status-icon icon-danger'>Number of Open Issues: " +repos[i].open_issues_count + "</p>";

                    
                        repoEl.appendChild(statusEl);
                        repoContainerEl.appendChild(repoEl);
                    }
                };
                displayRepos(data)
            })
        }else{
            console.log("Github User not found");
        }
    })
    .catch(function(error){
        console.log("Github is Unavailable at this time")
    })
}
githubStarred()