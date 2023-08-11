
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

/**
 * This function displays the user's repositories, using the ARRAY returned from the second '$.getJSON' call in our "when/then" function - i.e. an array of the user's repos
 */
function repoInformationHTML(repos) {
    // If the user has no repositories - i.e. checks it the array returned is empty - display the following HTML
    if (repos.length == 0) {  
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    // Otherwise, perform the below code
    var listItemsHTML = repos.map(function(repo) { // The .map() method iterates through the array and the function within the method gets each item and adds certain properties of the item (the repo)
                                                   // into an <li> element, using the GitHub API's 'keys', i.e. "html_url" (the html of the repo)
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    // Then, display a <div> with a heading, and an unordered list cotaining the result from the .map function (this was stored in the variable 'listItemsHTML')
    // Using .join("\n"), we join each <li> element returned and add a new line
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
    $("#gh-user-data").html(""); // These statements set the content of the user-data div and the repo-data div to an empty string, which stops
    $("#gh-repo-data").html(""); // the name and repos of all previous users that we've search for from appearing when the username input field is empty,

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

    $.when( // "when" we have a response from the GitHub API
        $.getJSON(`https://api.github.com/users/${username}`), // Load JSON-encoded data from the github server that returns the user (this will be the 'firstResponse' in the function below)
        $.getJSON(`https://api.github.com/users/${username}/repos`)  // Get the repositories for that user - THIS INFORMATION IS RETURNED AS AN ARRAY - (this will be the 'secondResponse' in the function below)

    ).then( // "then" perform the function below                                             
        function (firstResponse, secondResponse) { 

            var userData = firstResponse[0];  // When calling for two responses, each response is made into an array of two items 
            var repoData = secondResponse[0]; // Using indexing, take the first value of each array and assign it to its own variable for ease of use

            $("#gh-user-data").html(userInformationHTML(userData)); // Sets the user-data div's HTML to the HTML written in the userInformationHTML function, using the response from the input field (if it matches)
            $("#gh-repo-data").html(repoInformationHTML(repoData)); // Sets the repo-data div's HTML to the HTML written in the repoInformationHTML function, using the user's repo data from GitHub

        }, function(errorResponse) { // If an error occurs in the "when/then" promise, run this function

            if (errorResponse.status === 404) { // If no user is found on GitHub - a 404 response/"page not found" - display a "user not found" type message using the value of the user's input for the username field
                
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);

            } else if (errorResponse.status === 403) { // If too many API requests are made, show user the time they will be able to make a new request/search for another user
                
                console.log(errorResponse);
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000); 
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);

            } else { // Display an Error message if the status of the errorResponse is NOT a 404 response ("page not found"), e.g a 401 response
                
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`); // Get the JSON response from our errorResponse variable
            }
        });
}

// When the page has loaded, display the GitHub profile of the default "value" in the username input field, which would be the user "octocat"
$(document).ready(fetchGitHubInformation);