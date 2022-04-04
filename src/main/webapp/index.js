$(document).ready(function(){
    var username;
    var password;
    var userID;
    var availableSeats;
    var dayPrice;
    var transmission;
    var carID;
    var carIDrent;
    var carIDremove;
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
            data: JSON.stringify({
                "availableSeats": availableSeats,
                "dayPrice": dayPrice,
                "transmission": transmission
            }),
            success:function(xhr, status){
                alert("success");
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
    });
    $("#getAllCars").on("click", function(){
        $.ajax({
            url:"http://localhost:8080/cars",
            type: "GET",
            dataType: 'json',
            success:function(data){
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
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
    });
    $("#getCar").on("click", function(){
        carID = $("#carID").val();
        $.ajax({
            url:"http://localhost:8080/cars/" + carID,
            type: "GET",
            success:function(xhr, status){
                alert("success");
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
    });
    $("#getAvailableCars").on("click", function(){
        $.ajax({
            url:"http://localhost:8080/cars/availableCars",
            type: "GET",
            success:function(data){
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
                    th.setAttribute("onclick", "sortTable(" +i+")")
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
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
    });
    // BIS HIER REQUESTS FÜR CAR
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
            }),
            success:function(responseJSON){
                userID = responseJSON.id
                alert(userID + " registriert")
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
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
            }),
            success:function(responseJSON){
                userID = responseJSON.id;
                alert(userID + " eingelogged")
                //alert(responseJSON[0].id);
                $("#login").addClass("notdisplay")
                $("#loggedIn").removeAttr("style")
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
    });
    // BIS HIER REQUESTS FÜR USER
    // REQUESTS UM AUTO AUSZULEIHEN UND ZURÜCKGEBEN
    $("#addCarToUser").on("click", function(){
        carIDrent = $("#carIDrent").val();
        $.ajax({
            url:"http://localhost:8080/users/" + userID + "/cars/" + carIDrent,
            type: "POST",
            statusCode: {
                500: function(){
                    alert("The car with this Car-ID is already rented")
                }
            },
            success:function(){
                alert("car with carid: " + carIDrent + "is added to user with userid: " + userID);
            },
            error:function(xhr, status, error){
            }
        });
    });
    $("#removeCarFromUser").on("click", function(){
        carIDremove = $("#carIDremove").val();
        $.ajax({
            url:"http://localhost:8080/users/" + userID + "/cars/" + carIDremove,
            type: "DELETE",
            success:function(){
                alert("car with carid: " + carIDremove + "was given back by user with userid: " + userID);
            },
            error:function(xhr, status, error){
                alert(xhr.responseText);
            }
        });
    });
    // BIS HIER REQUESTS UM AUTO AUSZULEIHEN UND ZURÜCKGEBEN

});