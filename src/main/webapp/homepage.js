// @param carIDrent: ID of the car to be rented
function rentCar(carIDrent) {
    $.ajax({
        url: "http://localhost:8080/users/" + localStorage.getItem("userID") + "/cars/" + carIDrent,
        type: "POST",
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function () {
        getAvailableCars();
    }).fail(function (xhr) {
        alert(xhr.responseText)
    })
}
// give Car back
function removeCar(carIDremove) {
    $.ajax({
        url: "http://localhost:8080/users/" + localStorage.getItem("userID") + "/cars/" + carIDremove,
        type: "DELETE",
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function () {
        getMyCars();
    }).fail(function (xhr) {
        alert(xhr.responseText);
    })
}

function getAllCars() {
    $("#showAllCars").html("")
    $("#showAvailableCars").html("")
    $("#showMyCars").html("")
    $.ajax({
        url: "http://localhost:8080/cars",
        type: "GET",
        dataType: 'json',
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function (data) {
        createTable(data, "allCarsId", "showAllCars");
    }).fail(function (xhr) {
        alert(xhr.responseText);
    })
}

function getAvailableCars() {
    $("#showAllCars").html("")
    $("#showAvailableCars").html("")
    $("#showMyCars").html("")
    $.ajax({
        url: "http://localhost:8080/cars/availableCars",
        type: "GET",
        dataType: 'json',
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    }).done(function (data) {
        createTable(data, "availableCars", "showAvailableCars")
        let table = document.getElementById("availableCars");
        for (let i = 1; i < table.rows.length; i++) {
            let row = table.rows[i];
            let cell = row.insertCell(-1);
            cell.innerHTML = '<button id="' + data[i - 1].id + '" onclick="rentCar(' + data[i - 1].id + ')">Book Car</button>';
        }
    }).fail(function (xhr) {
        alert(xhr.responseText);
    })
}

function getMyCars() {
    $("#showAllCars").html("")
    $("#showAvailableCars").html("")
    $("#showMyCars").html("")
    $.ajax({
        url: "http://localhost:8080/users/" + localStorage.getItem("userID") + "/cars",
        type: "GET",
        dataType: 'json',
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function (data) {
        if (data.length === 0) {
            $("#showMyCars").html('<h3>You have no cars rented</h3>')
        } else {
            createTable(data, "myCars", "showMyCars");
            let table = document.getElementById("myCars");
            for (let i = 1; i < table.rows.length; i++) {
                let row = table.rows[i];
                let cell = row.insertCell(-1);
                cell.innerHTML = '<button id="' + data[i - 1].id + '" onclick="removeCar(' + data[i - 1].id + ')">Remove Car</button>';
            }
        }
    }).fail(function (xhr) {
        alert(xhr.responseText)
    })
}

function createTable(data, tableId, divId) {
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
    table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp");
    table.setAttribute("id", tableId);
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = table.insertRow(-1);                   // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.setAttribute("class", "mdl-data-table__cell--non-numeric");
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
    var divContainer = document.getElementById(divId);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("userID")
    localStorage.removeItem("token")
}

$(document).ready(function () {
    console.log("userID: " + localStorage.getItem("userID"))
    console.log("username: " + localStorage.getItem("username"))
    console.log(localStorage.getItem("token"))
/*    $("#createNewCar").on("click", function(){
        availableSeats = $("#availableSeats").val()
        dayPrice = $("#dayPrice").val()
        transmission = $("#transmission").val()
        $.ajax({
            url:"http://localhost:8080/cars",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                Authorization: localStorage.getItem("token")
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
*/
});