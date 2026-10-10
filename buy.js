
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

    // Show loading message
    booksContainer.innerHTML = "<p>Loading books...</p>";

    // Hide empty-state message while loading
    if (noBooks) {
        noBooks.hidden = true;
        noBooks.style.display = "none";
    }

    try {
        // Request books from the backend
        const response = await fetch("/api/books");

        const responseText = await response.text();

        console.log("API status:", response.status);
        console.log("API response:", responseText);

        if (!response.ok) {
            throw new Error(
                `Server error ${response.status}: ${responseText}`
            );
        }

        if (!responseText.trim()) {
            throw new Error("The server returned an empty response.");
        }

        // Convert response into JSON
        let books;

        try {
            books = JSON.parse(responseText);
        } catch (error) {
            throw new Error("The server did not return valid JSON.");
        }

        if (!Array.isArray(books)) {
            throw new Error("Expected an array of books.");
        }

        // Clear loading message
        booksContainer.innerHTML = "";

        // Show empty-state message only if no books exist
        if (books.length === 0) {
            if (noBooks) {
                noBooks.hidden = false;
                noBooks.style.display = "block";
            } else {
                booksContainer.textContent = "No books available yet.";
            }

            return;
        }

        // Books exist, so hide the empty-state section
        if (noBooks) {
            noBooks.hidden = true;
            noBooks.style.display = "none";
        }

        // Display each book
        books.forEach(function (book) {
            const card = document.createElement("div");
            card.className = "book-card";

            // Book image
            const image = document.createElement("img");

            if (book.image) {
                image.src = book.image;
            } else {
                image.alt = "No image available";
            }

            image.alt = book.name || "Book";
            image.loading = "lazy";

            // Book details container
            const details = document.createElement("div");
            details.className = "book-details";

            // Book title
            const title = document.createElement("h2");
            title.textContent = book.name || "Untitled";

            // Book price
            const price = document.createElement("p");
            price.className = "price";
            price.textContent = "₹" + book.price;

            // Buy button
            const button = document.createElement("button");
            button.className = "buy-btn";
            button.textContent = "Buy Now";

            button.addEventListener("click", function () {
                buyBook(book.name || "Untitled");
            });

            // Assemble the book card
            details.appendChild(title);
            details.appendChild(price);
            details.appendChild(button);

            card.appendChild(image);
            card.appendChild(details);

            booksContainer.appendChild(card);
        });

        console.log("Books displayed successfully:", books.length);

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
