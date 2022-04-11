$(document).ready(function () {
    console.log("userID: " + localStorage.getItem("userID"))
    console.log("username: " + localStorage.getItem("username"))
    console.log(localStorage.getItem("token"))
});

// @param carIDrent: ID of the car to be rented
function rentCar(carIDrent) {
    let text = "Do you want to rent the Car with ID: " + carIDrent + "?"
    if (confirm(text) === true) {
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
}

// give Car back
function removeCar(carIDremove) {
    let text = "Do you want to give the Car with ID: " + carIDremove + " back?"
    if (confirm(text) === true) {
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
}

function getAllCars() {
    $("#map").html('');
    $.ajax({
        url: "http://localhost:8080/cars",
        type: "GET",
        dataType: 'json',
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function (data) {
        if (data.length === 0) {
            $("#content").html('<h3>There are currently no cars to show</h3>')
        } else {
            createTable(data, "allCarsId");
            $("#allCarsId").before("<h3>All of our cars</h3>")
        }
    }).fail(function (xhr) {
        alert(xhr.responseText);
    })
}

function getAvailableCars() {
    $("#map").html('');
    $.ajax({
        url: "http://localhost:8080/cars/availableCars",
        type: "GET",
        dataType: 'json',
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    }).done(function (data) {
        if (data.length === 0) {
            $("#content").html('<h3>There are currently no cars available.</h3>')
        } else {
            if(selectedCurrency !== "USD") {
                convertCurrency(selectedCurrency,data);
            }
            createTable(data, "availableCars")
            $("#availableCars").before("<h3>Available Cars</h3>")
            let table = document.getElementById("availableCars");
            addRentOrRemoveButtons(table, data, "rent");
            createDropDownWithCurrencies("availableCars");
            $("select option[value='"+selectedCurrency+"']").attr("selected","selected")
        }
    }).fail(function (xhr) {
        alert(xhr.responseText);
    })
}

function addRentOrRemoveButtons(table, data, rentOrRemove) {
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let cell = row.insertCell(-1);
        if(rentOrRemove === "rent") {
            cell.innerHTML = '<button id="' + data[i - 1].id + '" onclick="rentCar(' + data[i - 1].id + ')">Rent Car</button>';
        } else if(rentOrRemove === "remove") {
            cell.innerHTML = '<button id="' + data[i - 1].id + '" onclick="removeCar(' + data[i - 1].id + ')">Give Car back</button>';
        }
    }
}

function createDropDownWithCurrencies(table) {
    $("#" + table + " tr th:last-child").after(
        "<select name='currency' id='currency'>" +
        "<option value='USD'>USD</option>" +
        "<option value='JPY'>JPY</option>" +
        "<option value='BGN'>BGN</option>" +
        "<option value='CZK'>CZK</option>" +
        "<option value='DKK'>DKK</option>" +
        "<option value='GBP'>GBP</option>" +
        "<option value='HUF'>HUF</option>" +
        "<option value='PLN'>PLN</option>" +
        "<option value='RON'>RON</option>" +
        "<option value='SEK'>SEK</option>" +
        "<option value='CHF'>CHF</option>" +
        "<option value='ISK'>ISK</option>" +
        "<option value='NOK'>NOK</option>" +
        "<option value='HRK'>HRK</option>" +
        "<option value='TRY'>TRY</option>" +
        "<option value='AUD'>AUD</option>" +
        "<option value='BRL'>BRL</option>" +
        "<option value='CAD'>CAD</option>" +
        "<option value='CNY'>CNY</option>" +
        "<option value='HKD'>HKD</option>" +
        "<option value='IDR'>IDR</option>" +
        "<option value='ILS'>ILS</option>" +
        "<option value='INR'>INR</option>" +
        "<option value='KRW'>KRW</option>" +
        "<option value='MXN'>MXN</option>" +
        "<option value='MYR'>MYR</option>" +
        "<option value='NZD'>NZD</option>" +
        "<option value='PHP'>PHP</option>" +
        "<option value='SGD'>SGD</option>" +
        "<option value='THB'>THB</option>" +
        "<option value='ZAR'>ZAR</option>" +
        "</select>")
    $("#currency").on("change", function () {
        selectedCurrency = $("#currency").find(":selected").text();
        getAvailableCars();
    })
}

let selectedCurrency = "USD";

function convertCurrency(currency, response) {
    $.ajax({
        url: "http://localhost:8080/converter/cars/" + currency,
        type: "POST",
        dataType: "json",
        async: false,
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function (data) {
        for(let i=0; i<response.length; i++) {
            response[i].dayPrice = data[i];
        }
    }).fail(function (xhr) {
        alert(xhr.responseText)
    })
}

function getMyCars() {
    $("#map").html('');
    $.ajax({
        url: "http://localhost:8080/users/" + localStorage.getItem("userID") + "/cars",
        type: "GET",
        dataType: 'json',
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).done(function (data) {
        if (data.length === 0) {
            $("#content").html('<h3>You have no cars rented</h3>')
        } else {
            createTable(data, "myCars");
            $("#myCars").before("<h3>Your currently rented cars</h3>")
            let table = document.getElementById("myCars");
            addRentOrRemoveButtons(table, data, "remove");
        }
    }).fail(function (xhr) {
        alert(xhr.responseText)
    })
}

function createTable(data, tableId) {
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
    var divContainer = document.getElementById("content");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

// Initialize and add the map
function initMap() {
    $("#content").html('<h3>See our location on the map</h3>');
    // The location of the company
    const companyLocation = {
        lat: 48.15809288969533,
        lng: 16.382344953755812
    };
    // The map, centered at companys location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: companyLocation,
    });
    // The marker, positioned at the companys location
    const marker = new google.maps.Marker({
        position: companyLocation,
        map: map,
    });
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("userID")
    localStorage.removeItem("token")
}

function preventBack() {
    window.history.forward();
}

setTimeout("preventBack()", 0);

window.onunload = function () {
    null;
};