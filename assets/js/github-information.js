
/**
 * This function displays the GitHub user's information using 'keys' from GitHub's API, i.e the user's number of repos
 */
function userInformationHTML(user) {
    return `
    <h2>${user.name}
        <span class="small-name">   
            (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
        </span>
    </h2>
    <div class="gh-content">
        <div class="gh-avatar">
            <a href="${user.html_url}" target="_blank">
                <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}">
            </a>
        </div>
        <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
    </div>`;
}

/**
 * This function is called when the user clicks on the username input field
 */
function fetchGitHubInformation(event) {
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
        $.getJSON(`https://api.github.com/users/${username}`) // Load JSON-encoded data from the github server - "when" the value of the username input field matches a user on GitHub
    ).then(                                                   // "then" perform the function below
        function(response) {
            var userData = response;
            $("#gh-user-data").html(userInformationHTML(userData)); // Sets the user-data div's HTML to the HTML written in the userInformationHTML function, using the response from the input field (if it matches)
        }, function(errorResponse) { // If an error occurs in the "when/then" promise, run this function
            if (errorResponse.status === 404) { // If no user is found on GitHub, display a "user not found" type message using the value of the user's input for the username field
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`); 
            } else { // Display an Error message if an error of the error occurs ??
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        })
}