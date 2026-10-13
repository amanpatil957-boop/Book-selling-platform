
document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("booksContainer");
    const noBooks = document.getElementById("noBooks");

    async function loadBooks() {
        if (!booksContainer) {
            console.error("booksContainer element not found in buy.html");
            return;
        }

        booksContainer.innerHTML = "<p>Loading books...</p>";

        try {
            const response = await fetch("/api/books");

            if (!response.ok) {
                throw new Error("Failed to load books.");
            }

            const books = await response.json();
            booksContainer.innerHTML = "";

            if (noBooks) {
                noBooks.hidden = books.length > 0;
                noBooks.style.display = books.length > 0 ? "none" : "block";
            }

            if (books.length === 0) {
                if (noBooks) {
                    noBooks.hidden = false;
                    noBooks.style.display = "block";
                } else {
                    booksContainer.innerHTML =
                        "<p>No books are available right now.</p>";
                }
                return;
            }

            books.forEach(function (book) {
                const card = document.createElement("div");
                card.className = "book-card";

                const img = document.createElement("img");
                const placeholder =
                    "https://placehold.co/300x400?text=Book";

                img.src = book.image || placeholder;
                img.alt = book.name || "Book";
                img.className = "book-image";

                img.onerror = function () {
                    this.onerror = null;
                    this.src = placeholder;
                };

                const details = document.createElement("div");
                details.className = "book-details";

                const title = document.createElement("h3");
                title.className = "book-title";
                title.textContent = book.name || "Untitled Book";

                const price = document.createElement("p");
                price.className = "book-price";
                price.textContent =
                    "₹" + Number(book.price || 0).toLocaleString("en-IN");

                const seller = document.createElement("p");
                seller.className = "book-seller";
                seller.textContent =
                    "Seller: " + (book.sellerName || "Not provided");

                const buyButton = document.createElement("button");
                buyButton.type = "button";
                buyButton.textContent = "Buy Now";
                buyButton.className = "buy-button";

                buyButton.addEventListener("click", async function () {
                    const currentUser = localStorage.getItem("currentUser");

                    if (!currentUser) {
                        alert("Please log in first.");
                        window.location.href = "auth.html";
                        return;
                    }

                    let buyerName = "";
                    let buyerEmail = "";

                    try {
                        const user = JSON.parse(currentUser);

                        if (user && typeof user === "object") {
                            buyerName = user.name || user.username || "";
                            buyerEmail = user.email || "";
                        } else {
                            buyerName = String(user || "");
                        }
                    } catch (error) {
                        console.error("Could not read logged-in user:", error);
                    }

                    const enteredName = prompt(
                        "Enter your full name:",
                        buyerName
                    );

                    if (!enteredName || !enteredName.trim()) {
                        alert("Please enter your name.");
                        return;
                    }

                    const enteredEmail = prompt(
                        "Enter your email:",
                        buyerEmail
                    );

                    const email = enteredEmail
                        ? enteredEmail.trim().toLowerCase()
                        : "";

                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        alert("Please enter a valid email address.");
                        return;
                    }

                    const buyerPhone = prompt("Enter your phone number:");

                    if (!buyerPhone || !buyerPhone.trim()) {
                        alert("Please enter your phone number.");
                        return;
                    }

                    const confirmed = confirm(
                        "Confirm your order?\n\n" +
                        "Book: " + book.name + "\n" +
                        "Price: ₹" + book.price + "\n" +
                        "Seller: " + (book.sellerName || "Not provided") +
                        "\n\nPayment: In person\n" +
                        "Collection: Contact the seller\n\n" +
                        "No online payment will be made."
                    );

                    if (!confirmed) {
                        return;
                    }

                    buyButton.disabled = true;
                    buyButton.textContent = "Placing order...";

                    try {
                        const orderResponse = await fetch("/api/orders", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                bookId: book._id,
                                buyerName: enteredName.trim(),
                                buyerEmail: email,
                                buyerPhone: buyerPhone.trim()
                            })
                        });

                        const result = await orderResponse.json();

                        if (!orderResponse.ok) {
                            throw new Error(
                                result.message || "Could not place your order."
                            );
                        }

                        const order = result.order || {};

                        let message =
                            "Order request created successfully!\n\n" +
                            "Book: " + (order.bookName || book.name) + "\n" +
                            "Price: ₹" + (order.price ?? book.price) + "\n" +
                            "Order ID: " +
                            (order.id || order._id || "Created") +
                            "\n\nPlease contact the seller to arrange " +
                            "collection and payment in person.";

                        if (order.sellerEmail) {
                            message += "\nSeller email: " + order.sellerEmail;
                        }

                        alert(message);

                        const openCart = confirm(
                            "Would you like to view your orders now?"
                        );

                        if (openCart) {
                            window.location.href = "cart.html";
                            return;
                        }

                        await loadBooks();
                    } catch (error) {
                        console.error("Order error:", error);
                        alert(error.message || "Something went wrong.");
                    } finally {
                        buyButton.disabled = false;
                        buyButton.textContent = "Buy Now";
                    }
                });

                details.appendChild(title);
                details.appendChild(price);
                details.appendChild(seller);
                details.appendChild(buyButton);

                card.appendChild(img);
                card.appendChild(details);
                booksContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Loading books error:", error);
            booksContainer.innerHTML =
                "<p>Could not load books. Please refresh and try again.</p>";
        }
    }

    loadBooks();
});
