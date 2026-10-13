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
                booksContainer.innerHTML = "<p>No books are available right now.</p>";
                return;
            }

            books.forEach(function (book) {
                const card = document.createElement("div");
                card.className = "book-card";

                const img = document.createElement("img");
                img.src = book.image || "";
                img.alt = book.name || "Book";
                img.className = "book-image";

                const title = document.createElement("h3");
                title.textContent = book.name || "Untitled Book";

                const price = document.createElement("p");
                price.textContent = "₹" + book.price;
                price.className = "book-price";

                const seller = document.createElement("p");
                seller.textContent = "Seller: " + (book.sellerName || "Not provided");

                const buyButton = document.createElement("button");
                buyButton.textContent = "Buy Now";
                buyButton.className = "buy-button";

                buyButton.addEventListener("click", async function () {
                    const currentUser = localStorage.getItem("currentUser");

                    if (!currentUser) {
                        alert("Please login first.");
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
                    } catch {
                        buyerName = currentUser;
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

                    if (
                        !enteredEmail ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enteredEmail.trim())
                    ) {
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
                        "Seller: " + (book.sellerName || "Not provided") + "\n\n" +
                        "Payment: In person\n" +
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
                                buyerEmail: enteredEmail.trim(),
                                buyerPhone: buyerPhone.trim()
                            })
                        });

                        const result = await orderResponse.json();

                        if (!orderResponse.ok) {
                            throw new Error(
                                result.message || "Could not place your order."
                            );
                        }

                        let message =
                            "Order request created successfully!\n\n" +
                            "Book: " + result.order.bookName + "\n" +
                            "Price: ₹" + result.order.price + "\n" +
                            "Order ID: " + result.order.id + "\n\n" +
                            "Please contact the seller to arrange collection " +
                            "and payment in person.";

                        if (result.order.sellerEmail) {
                            message +=
                                "\nSeller email: " + result.order.sellerEmail;
                        }

                        alert(message);

                        await loadBooks();
                    } catch (error) {
                        console.error("Order error:", error);
                        alert(error.message || "Something went wrong.");
                    } finally {
                        buyButton.disabled = false;
                        buyButton.textContent = "Buy Now";
                    }
                });

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(price);
                card.appendChild(seller);
                card.appendChild(buyButton);

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