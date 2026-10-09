
const bookForm = document.getElementById("bookForm");

// Check whether the user is logged in
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    alert("Please login first.");
    window.location.href = "auth.html";
}

// Display seller's books
async function displaySellerBooks() {
    const sellerBooks = document.getElementById("sellerBooks");

    sellerBooks.innerHTML = "<p>Loading books...</p>";

    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const books = await response.json();

        sellerBooks.innerHTML = "";

        if (books.length === 0) {
            sellerBooks.innerHTML = "<p>No books listed yet.</p>";
            return;
        }

        books.forEach(function (book) {
            const card = document.createElement("div");
            card.className = "seller-book-card";

            const img = document.createElement("img");
            img.src = book.image || "";
            img.alt = book.name;

            const info = document.createElement("div");
            info.className = "book-info";

            const title = document.createElement("h3");
            title.textContent = book.name;

            const price = document.createElement("p");
            price.textContent = `₹${book.price}`;

            info.appendChild(title);
            info.appendChild(price);
            card.appendChild(img);
            card.appendChild(info);
            sellerBooks.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        sellerBooks.innerHTML =
            "<p>Could not load books. Please try again.</p>";
    }
}

// Submit a new book to MongoDB
if (bookForm) {
    bookForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!localStorage.getItem("currentUser")) {
            alert("Please login first.");
            window.location.href = "auth.html";
            return;
        }

        const bookName =
            document.getElementById("bookName").value.trim();

        const bookPrice =
            document.getElementById("bookPrice").value;

        const imageInput =
            document.getElementById("bookImage");

        if (!bookName || bookPrice === "") {
            alert("Please enter the book name and price.");
            return;
        }

        if (!imageInput.files || imageInput.files.length === 0) {
            alert("Please select a book image.");
            return;
        }

        const imageFile = imageInput.files[0];

        // Convert the selected image to Base64
        const reader = new FileReader();

        reader.onload = async function () {
            try {
                // Supports a string or a JSON object in currentUser.
                let sellerName = "";
                let sellerEmail = "";

                try {
                    const user = JSON.parse(
                        localStorage.getItem("currentUser")
                    );

                    if (user && typeof user === "object") {
                        sellerName = user.name || user.username || "";
                        sellerEmail = user.email || "";
                    }
                } catch {
                    // currentUser may be stored as a plain string.
                    sellerName = currentUser;
                }

                const response = await fetch("/api/books", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: bookName,
                        price: Number(bookPrice),
                        image: reader.result,
                        sellerName,
                        sellerEmail
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Could not add book"
                    );
                }

                alert("Book added successfully!");

                bookForm.reset();

                await displaySellerBooks();
            } catch (error) {
                console.error(error);
                alert(error.message || "Failed to add book.");
            }
        };

        reader.onerror = function () {
            alert("Could not read the selected image.");
        };

        reader.readAsDataURL(imageFile);
    });
}

// Load books when the page opens
displaySellerBooks();