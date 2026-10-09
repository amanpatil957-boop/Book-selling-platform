
/* =========================
   CHECK LOGIN
========================= */

if (!localStorage.getItem("currentUser")) {
    alert("Please login first.");
    window.location.href = "auth.html";
}


/* =========================
   ELEMENTS
========================= */

const booksContainer = document.getElementById("booksContainer");
const noBooks = document.getElementById("noBooks");


/* =========================
   LOAD BOOKS FROM MONGODB
========================= */

async function displayBooks() {
    if (!booksContainer) {
        console.error("booksContainer not found in buy.html");
        return;
    }

    booksContainer.innerHTML = "<p>Loading books...</p>";

    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Failed to load books from server");
        }

        const books = await response.json();

        booksContainer.innerHTML = "";

        // Handle an empty book list
        if (!books || books.length === 0) {
            if (noBooks) {
                noBooks.style.display = "block";
            } else {
                booksContainer.textContent = "No books available yet.";
            }
            return;
        }

        if (noBooks) {
            noBooks.style.display = "none";
        }

        // Display every available book
        books.forEach(function (book) {
            const card = document.createElement("div");
            card.className = "book-card";

            const image = document.createElement("img");
            image.src = book.image || "";
            image.alt = book.name || "Book";
            image.loading = "lazy";

            const details = document.createElement("div");
            details.className = "book-details";

            const title = document.createElement("h2");
            title.textContent = book.name;

            const price = document.createElement("p");
            price.className = "price";
            price.textContent = "₹" + book.price;

            const button = document.createElement("button");
            button.className = "buy-btn";
            button.textContent = "Buy Now";

            button.addEventListener("click", function () {
                buyBook(book.name);
            });

            details.appendChild(title);
            details.appendChild(price);
            details.appendChild(button);

            card.appendChild(image);
            card.appendChild(details);

            booksContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading books:", error);

        booksContainer.innerHTML =
            "<p>Unable to load books. Please refresh the page.</p>";
    }
}


/* =========================
   BUY BUTTON
========================= */

function buyBook(bookName) {
    alert(
        "You selected: " +
        bookName +
        "\n\nThank you for choosing Book Haven!"
    );
}


/* =========================
   RUN WHEN PAGE LOADS
========================= */

displayBooks();