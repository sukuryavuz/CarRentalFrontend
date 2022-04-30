$(document).ready(function () {
    console.log("userID: " + localStorage.getItem("userID"))
    console.log("username: " + localStorage.getItem("username"))
    console.log(localStorage.getItem("token"))
});

let baseURL_dev = "http://localhost:8080/"
let baseURL_prod = "https://carrentalgrup3.azurewebsites.net/"

function getAllCars() {
    let url, type;
    url = baseURL_dev + "cars?currency=" + localStorage.getItem("selectedCurrency");
    type = "GET";
    $.ajax({
        url: url,
        type: type,
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
            createDropDownWithCurrencies("allCarsId", "currencyAllCars", getAllCars);
            $("select option[value='" + localStorage.getItem("selectedCurrency") + "']").attr("selected", "selected")
            $("td:last-child").after("<td></td>")
        }
    }).fail(function (xhr) {
        if (xhr.status === 500) {
            alert("Currency Converter is currently not available. Please try later again.")
            localStorage.setItem("selectedCurrency", "USD");
            getAllCars()
        } else {
            alert(xhr.responseText);
        }
    })
}

function getAvailableCars() {
    let url, type;
    url = baseURL_dev + "cars/availableCars?currency=" + localStorage.getItem("selectedCurrency");
    type = "GET";
    $.ajax({
        url: url,
        type: type,
        dataType: 'json',
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    }).done(function (data) {
        if (data.length === 0) {
            $("#content").html('<h3>There are currently no cars available.</h3>')
        } else {
            createTable(data, "availableCars")
            $("#availableCars").before("<h3>Available Cars</h3>")
            let table = document.getElementById("availableCars");
            addRentOrRemoveButtons(table, data, "rent");
            createDropDownWithCurrencies("availableCars", "currencyAvailableCars", getAvailableCars);
            $("select option[value='" + localStorage.getItem("selectedCurrency") + "']").attr("selected", "selected")
        }
    }).fail(function (xhr) {
        if (xhr.status === 500) {
            alert("Currency Converter is currently not available. Please try later again.")
            localStorage.setItem("selectedCurrency", "USD");
            getAvailableCars()
        } else {
            alert(xhr.responseText);
        }
    })
}

// @param carIDrent: ID of the car to be rented
function rentCar(carIDrent) {
    let text = "Do you want to rent the Car with ID: " + carIDrent + "?"
    if (confirm(text) === true) {
        $.ajax({
            url: baseURL_dev + "users/" + localStorage.getItem("userID") + "/cars/" + carIDrent,
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

function getMyCars() {
    let url, type;
    url = baseURL_dev + "users/" + localStorage.getItem("userID") + "/cars?currency=" + localStorage.getItem("selectedCurrency");
    type = "GET";
    $.ajax({
        url: url,
        type: type,
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
            createDropDownWithCurrencies("myCars", "currencyMyCars", getMyCars);
            $("select option[value='" + localStorage.getItem("selectedCurrency") + "']").attr("selected", "selected")

        }
    }).fail(function (xhr) {
        if (xhr.status === 500) {
            alert("Currency Converter is currently not available. Please try later again.")
            localStorage.setItem("selectedCurrency", "USD");
            getMyCars()
        } else {
            alert(xhr.responseText)
        }
    })
}

// return car
function removeCar(carIDremove) {
    let text = "Do you want to give the Car with ID: " + carIDremove + " back?"
    if (confirm(text) === true) {
        $.ajax({
            url: baseURL_dev + "users/" + localStorage.getItem("userID") + "/cars/" + carIDremove,
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

function addRentOrRemoveButtons(table, data, rentOrRemove) {
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let cell = row.insertCell(-1);
        if (rentOrRemove === "rent") {
            cell.innerHTML = '<button class="rentCarBtns" id="' + data[i - 1].id + '" onclick="rentCar(' + data[i - 1].id + ')">Rent Car</button>';
        } else if (rentOrRemove === "remove") {
            cell.innerHTML = '<button class="giveCarBackBtns" id="' + data[i - 1].id + '" onclick="removeCar(' + data[i - 1].id + ')">Return Car</button>';
        }
    }
}

function createDropDownWithCurrencies(table, selectionId, callback) {
    $("#" + table + " tr th:last-child").after(
        "<select name='" + selectionId + "' id='" + selectionId + "'>" +
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
    $("#" + selectionId + "").on("change", function () {
        let selectedCurrency = $("#" + selectionId + "").find(":selected").text();
        localStorage.setItem("selectedCurrency", selectedCurrency);
        callback();
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
            if (j === 3) {
                tabCell.innerHTML = Number(data[i][col[j]]).toFixed(2);
            } else {
                tabCell.innerHTML = data[i][col[j]];
            }
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("content");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    //ADD ONCLICK FUNCTION TO DAYPRICE TO SORT COLUMN
    addCarPicture(table);
    addOnclickToSortTableByColumnName(table, "dayPrice");
    addOnclickToSortTableByColumnName(table, "availableSeats");
}

function addCarPicture(table) {
    for(let i=0; i<table.rows.length; i++) {
        let cell = table.rows[i].insertCell(0);
        if(i===0) continue;
        cell.innerHTML = '<img src="images/audiq5.png" alt="">';
    }
}

function addOnclickToSortTableByColumnName(table, columnName) {
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        if (table.rows[0].cells[i].innerHTML === columnName) {
            let cell = table.rows[0].cells[i];
            cell.onclick = function () {
                sortTableColumn(table, i);
            }
        }
    }
}

function sortTableColumn(table, columnNumber) {
    var rows, switching, i, x, y, shouldSwitch;
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnNumber];
            y = rows[i + 1].getElementsByTagName("TD")[columnNumber];
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// Initialize and add the map
function initMap() {
    $("#content").html('<h3>Our Location</h3>');
    $("#map").css("display", "block");

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
};