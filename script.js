```javascript
/* =========================
   BROWSE POPUP
========================= */

function openBrowse() {

    document.getElementById("browseOptions")
        .style.display = "flex";

}


function closeBrowse() {

    document.getElementById("browseOptions")
        .style.display = "none";

}


/* =========================
   CHECK LOGIN
========================= */

function isLoggedIn() {

    return localStorage.getItem("currentUser") !== null;

}


/* =========================
   BUY
========================= */

function goToBuy() {

    if (!isLoggedIn()) {

        alert("Please login first.");

        window.location.href = "auth.html";

        return;
    }

    window.location.href = "buy.html";

}


/* =========================
   SELL
========================= */

function goToSell() {

    if (!isLoggedIn()) {

        alert("Please login first.");

        window.location.href = "auth.html";

        return;
    }

    window.location.href = "sell.html";

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("currentUser");

    alert("You have been logged out.");

    window.location.href = "index.html";

}


/* =========================
   NAVBAR
========================= */

function updateNavbar() {

    const authLink =
        document.getElementById("authLink");


    if (!authLink) {

        return;
    }


    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    if (currentUser) {

        authLink.textContent =
            "Logout (" + currentUser.name + ")";

        authLink.href = "#";

        authLink.onclick = function(event) {

            event.preventDefault();

            logout();

        };

    } else {

        authLink.textContent = "Login";

        authLink.href = "auth.html";

    }

}
```
