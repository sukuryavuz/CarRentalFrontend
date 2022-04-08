// sobald sich der User einlogged, wird der username, die userID und der token im localstorage gespeichert
$(document).ready(function() {
    var username, password, userID
    $("#register").on("click", function () {
        username = $("#username").val()
        password = $("#password").val()
        $.ajax({
            url: "http://localhost:8080/register",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "username": username,
                "password": password
            })
        }).done(function (responseJSON) {
            userID = responseJSON.id
            alert(userID + " registriert")
            $("#username").val('')
            $("#password").val('')
        }).fail(function (xhr) {
            alert(xhr.responseText);
            $("#username").val('')
            $("#password").val('')
        })
    });
})
function saveData(){
    alert("in saveData drinnen")
    var username = $("#username").val()
    var password = $("#password").val()
    $.ajax({
        url: "http://localhost:8080/login",
        type: "POST",
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        data: JSON.stringify({
            "username": username,
            "password": password
        })
    }).done(function (responseJSON) {
        console.log("done wird ausgeführt")
        let userID = responseJSON.userId;
        let jwtToken = responseJSON.jwtToken;
        localStorage.setItem("userID", userID);
        localStorage.setItem("username", username)
        localStorage.setItem("token", "Bearer " + jwtToken);
        alert("User: " + username + " mit der userID: " + userID + " ist eingelogged.");
        console.log("Token: " + jwtToken)
        //alert(responseJSON[0].id);
    }).fail(function (xhr) {
        alert(xhr.responseText);
        $("#username").val('')
        $("#password").val('')
    });
}