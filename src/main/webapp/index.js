$(document).ready(function(){
    var username; // wird in localstorage gespeichert
    var password;
    var userID; // wird in localstorage gespeichert
    var availableSeats;
    var dayPrice;
    var transmission;
    var carID;
    var carIDrent;
    var carIDremove;
    var jwtToken; // wird in sessionstorage gespeichert
    // REQUESTS FÜR USER
    $("#register").on("click", function(){
        username = $("#username").val()
        password = $("#password").val()
        $.ajax({
            url:"http://localhost:8080/register",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "username": username,
                "password": password
            })
        }).done(function(responseJSON){
            userID = responseJSON.id
            alert(userID + " registriert")
            $("#username").val('')
            $("#password").val('')
        }).fail(function(xhr){
            alert(xhr.responseText);
            $("#username").val('')
            $("#password").val('')
        })
    });
    $("#loginBtn").on("click", function(){
        username = $("#username").val()
        password = $("#password").val()
        $.ajax({
            url:"http://localhost:8080/login",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "username": username,
                "password": password
            })
        }).done(function(responseJSON){
            userID = responseJSON.userId;
            jwtToken = responseJSON.jwtToken;
            localStorage.setItem("userID", userID);
            localStorage.setItem("username", username)
            sessionStorage.setItem("token", "Bearer " + jwtToken);
            alert(userID + " eingelogged " + jwtToken)
            //alert(responseJSON[0].id);
            $("#login").addClass("notdisplay")
            $("#loggedIn").removeAttr("style")
        }).fail(function(xhr){
            alert(xhr.responseText);
            $("#username").val('')
            $("#password").val('')
        })
    });
    // BIS HIER REQUESTS FÜR USER
    // REQUESTS FÜR CAR
    $("#createNewCar").on("click", function(){
        availableSeats = $("#availableSeats").val()
        dayPrice = $("#dayPrice").val()
        transmission = $("#transmission").val()
        $.ajax({
            url:"http://localhost:8080/cars",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                Authorization: sessionStorage.getItem("token")
            },
            data: JSON.stringify({
                "availableSeats": availableSeats,
                "dayPrice": dayPrice,
                "transmission": transmission
            })
        }).done(function(){
                alert("success");
        }).fail(function(xhr) {
            alert(xhr.responseText);
        });
    });
    $("#getAllCars").on("click", function(){
        $.ajax({
            url:"http://localhost:8080/cars",
            type: "GET",
            dataType: 'json',
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).done(function(data){
                var col = [];
                for (var i = 0; i < data.length; i++) {
                    for (var key in data[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                        }
                    }
                }
                // CREATE DYNAMIC TABLE.
                var table = document.createElement("table");
                // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
                var tr = table.insertRow(-1);                   // TABLE ROW.
                for (var i = 0; i < col.length; i++) {
                    var th = document.createElement("th");      // TABLE HEADER.
                    th.innerHTML = col[i];
                    tr.appendChild(th);
                }
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < data.length; i++) {
                    tr = table.insertRow(-1);
                    for (var j = 0; j < col.length; j++) {
                        var tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = data[i][col[j]];
                    }
                }
                // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                var divContainer = document.getElementById("showAllCars");
                divContainer.innerHTML = "";
                divContainer.appendChild(table);
            }).fail(function (xhr){
                alert(xhr.responseText);
            })
    });
    $("#getCar").on("click", function(){
        carID = $("#carID").val();
        $.ajax({
            url:"http://localhost:8080/cars/" + carID,
            type: "GET",
            headers: {
                Authorization: sessionStorage.getItem("token")
            },
        }).done(function(){
                alert("success");
            }).fail(function (xhr){
                alert(xhr.responseText);
            })
    });
    $("#getAvailableCars").on("click", function(){
        $.ajax({
            url:"http://localhost:8080/cars/availableCars",
            type: "GET",
            dataType: 'json',
            headers: {
                "Authorization": sessionStorage.getItem("token")
            }
        }).done(function(data){
                var col = [];
                for (var i = 0; i < data.length; i++) {
                    for (var key in data[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                        }
                    }
                }
                // CREATE DYNAMIC TABLE.
                var table = document.createElement("table");
                table.setAttribute("id", "availableCars")
                // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
                var tr = table.insertRow(-1);                   // TABLE ROW.
                for (var i = 0; i < col.length; i++) {
                    var th = document.createElement("th");      // TABLE HEADER.
                    th.setAttribute('id', col[i]);
                    th.innerHTML = col[i];
                    tr.appendChild(th);
                }
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < data.length; i++) {
                    tr = table.insertRow(-1);
                    for (var j = 0; j < col.length; j++) {
                        var tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = data[i][col[j]];
                    }
                }
                // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                var divContainer = document.getElementById("showAvailableCars");
                divContainer.innerHTML = "";
                divContainer.appendChild(table);
            }).fail(function(xhr){
                alert(xhr.responseText);
            })
    });
    $("#getCars").on("click", function(){
        $.ajax({
            url:"http://localhost:8080/users/" + localStorage.getItem("userID") + "/cars",
            type:"GET",
            dataType: 'json',
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).done(function(responseJSON){
            if(responseJSON.length) {
                alert("You have not any cars rented yet")
            } else {
                //TODO: zurückgeliefertes JSON in Tabelle einfügen und in der UI anzeigen
            }
        }).fail(function(xhr){
            alert(xhr.responseText)
        })
    });
    // BIS HIER REQUESTS FÜR CAR
    // REQUESTS UM AUTO AUSZULEIHEN UND ZURÜCKGEBEN
    $("#addCarToUser").on("click", function(){
        carIDrent = $("#carIDrent").val();
        $.ajax({
            url:"http://localhost:8080/users/" + userID + "/cars/" + carIDrent,
            type: "POST",
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).done(function(){
                alert("car with carid: " + carIDrent + "is added to user with userid: " + userID);
            }).fail(function(xhr){
                alert(xhr.responseText)
            })
    });
    $("#removeCarFromUser").on("click", function(){
        carIDremove = $("#carIDremove").val();
        $.ajax({
            url:"http://localhost:8080/users/" + userID + "/cars/" + carIDremove,
            type: "DELETE",
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).done(function(){
                alert("car with carid: " + carIDremove + "was given back by user with userid: " + userID);
            }).fail(function(xhr){
                alert(xhr.responseText);
            })
    });
    // BIS HIER REQUESTS UM AUTO AUSZULEIHEN UND ZURÜCKGEBEN
});