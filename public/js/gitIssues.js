// function to asynchronously find all users github repos with issues and display on homepage
async function githubIssues(user){
    // user will be userID for github
    const user = document.querySelector("#githubusername").value;
    const apiUrl = "https://api.github.com/users/" + user +"/repos";
    // grab users public github repo data
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // function to show repos w/ issues, not declared as of yet
                // perhaps us handlebars.js to display repos?
                displayRepos =() =>{
                    for (let i = 0; i < repos.length; i++) {
                        const repoName = repos[i].name;

                        
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