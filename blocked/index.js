const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)

var blockedUrlDiv = $("#blockedUrl")
var blocked_url = queryString.substr(1).split("=")

blockedUrlDiv.html(blocked_url[1] + " is blocked")