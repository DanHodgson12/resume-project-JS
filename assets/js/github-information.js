
/**
 * This function displays the GitHub user's information using 'keys' from GitHub's API, i.e the user's number of repos
 */
function userInformationHTML(user) {
    return `
    <h2>${user.name}
        <span class="small-name">   
            // (@<a href="${user.html_url}" target="_blank">${user.login}</a>) 
        </span>
    </h2>
    <div class="gh-content">
        <div class="gh-avatar">
            <a href="${user.html_url}" target="_blank">
                <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}">
            </a>
        </div>
        <p>Followers: ${user.followers} | Following: ${user.following} <br> Repos: ${user.public_repos}</p>
    </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

/**
 * This function is called when the user clicks on the username input field
 */
function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val(); // Store the value of the username input field in a variable called "username"
    if (!username) { 
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`); // If the username field is empty, set the user-data div to display some HTML
        return; // Leave the function after the above code has been run, so that we don't access the github API when the field is empty
    }
    
    $("#gh-user-data").html( // If the user has entered something into the username input field, display a 'loader' gif to indicate that information is being retrieved
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`
    );

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`), // Load JSON-encoded data from the github server - "when" we have a response from the GitHub API
        $.getJSON(`https://api.github.com/users/${username}/repos`)  // Gets the repositories for that individual user
    ).then(                                                   
        function (firstResponse, secondResponse) { // "then" perform the function below
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData)); // Sets the user-data div's HTML to the HTML written in the userInformationHTML function, using the response from the input field (if it matches)
            $("#gh-repo-data").html(repoInformationHTML(repoData)); // Sets the repo-data div's HTML to the HTML written in the repoInformationHTML function, using the user's repo data from GitHub
        }, function(errorResponse) { // If an error occurs in the "when/then" promise, run this function
            if (errorResponse.status === 404) { // If no user is found on GitHub, display a "user not found" type message using the value of the user's input for the username field
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`); 
            } else { // Display an Error message if the status of the errorResponse is NOT a 404 response ("page not found"), e.g a 401 response
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`); // Get the JSON response from our errorResponse variable
            }
        })
}

$(document).ready(fetchGitHubInformation);