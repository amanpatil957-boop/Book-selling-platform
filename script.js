
/* =========================
   BROWSE POPUP
========================= */

function openBrowse() {
    document.getElementById("browseOptions").style.display = "flex";
}

function closeBrowse() {
    document.getElementById("browseOptions").style.display = "none";
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
    const authLink = document.getElementById("authLink");

    if (!authLink) return;

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("currentUser")
        );
    } catch (error) {
        console.error("Could not read current user:", error);
    }

    if (currentUser) {
        const userName =
            currentUser.name || currentUser.username || "User";

        authLink.textContent = "Logout (" + userName + ")";
        authLink.href = "#";

        authLink.onclick = function (event) {
            event.preventDefault();
            logout();
        };
    } else {
        authLink.textContent = "Login";
        authLink.href = "auth.html";
        authLink.onclick = null;
    }
}


/* =========================
   LOAD BOOKS FROM MONGODB
========================= */

async function loadBooksFromMongoDB() {
    // Update this ID if your homepage uses a different book container ID.
    const bookContainer =
        document.getElementById("bookContainer") ||
        document.getElementById("booksContainer") ||
        document.getElementById("bookList") ||
        document.getElementById("booksList");

    // Do nothing if this page has no book listing container.
    if (!bookContainer) {
        console.log("No homepage book container found.");
        return;
    }

    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Could not load books from the server.");
        }

        const books = await response.json();

        bookContainer.innerHTML = "";

        if (books.length === 0) {
            bookContainer.textContent = "No books available yet.";
            return;
        }

        books.forEach(function (book) {
            const card = document.createElement("div");
            card.className = "book-card";

            const image = document.createElement("img");
            image.src = book.image || "";
            image.alt = book.name || "Book";
            image.loading = "lazy";

            const name = document.createElement("h3");
            name.textContent = book.name;

            const price = document.createElement("p");
            price.textContent = "₹" + book.price;

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(price);

            bookContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading books:", error);
        bookContainer.textContent =
            "Unable to load books. Please refresh the page.";
    }
}


/* =========================
   INITIALIZE PAGE
========================= */

document.addEventListener("DOMContentLoaded", function () {
    updateNavbar();
    loadBooksFromMongoDB();
});