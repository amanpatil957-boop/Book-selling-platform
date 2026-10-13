console.log("BOOK HAVEN CART.JS IS RUNNING");
document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cartContainer");
    const bookCount = document.getElementById("bookCount");

    async function loadMyOrders() {
        if (!cartContainer || !bookCount) {
            console.error("cartContainer or bookCount is missing in cart.html");
            return;
        }

        const currentUser = localStorage.getItem("currentUser");
        console.log("CURRENT USER:", currentUser);

        if (!currentUser) {
            bookCount.textContent = "0 books";
            cartContainer.innerHTML = `
                <div class="empty-message">
                    <h3>Please log in to view your orders</h3>
                    <p>Log in to see the books you have ordered.</p>
                    <a href="auth.html" class="shop-button">Login</a>
                </div>
            `;
            return;
        }

        let buyerEmail = "";

        try {
            const user = JSON.parse(currentUser);

if (user && typeof user === "object") {
    buyerEmail = (user.email || "").trim().toLowerCase();
}
        } catch (error) {
            // currentUser may be stored as a plain string.
            console.log("currentUser is not a JSON object.");
        }

        if (!buyerEmail) {
            bookCount.textContent = "0 books";
            cartContainer.innerHTML = `
                <div class="empty-message">
                    <h3>Email address required</h3>
                    <p>Your saved login does not contain an email address.
                    The cart needs the same email you entered when ordering.</p>
                    <a href="buy.html" class="shop-button">Browse Books</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML =
            '<div class="loading-message">Loading your orders...</div>';

        try {
            const response = await fetch(
                "/api/orders?buyerEmail=" + encodeURIComponent(buyerEmail.trim())
            );

            const result = await response.json();
            console.log("ORDERS API STATUS:", response.status);
            console.log("ORDERS API RESULT:", result);
            console.log("EMAIL USED FOR CART:", buyerEmail);

            if (!response.ok) {
                throw new Error(result.message || "Failed to load orders.");
            }

            if (!Array.isArray(result)) {
                throw new Error("Unexpected response from the server.");
            }

            bookCount.textContent =
                result.length + (result.length === 1 ? " book" : " books");

            if (result.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-message">
                        <div class="empty-icon">📚</div>
                        <h3>Your cart is empty</h3>
                        <p>You haven't ordered any books yet.</p>
                        <a href="buy.html" class="shop-button">
                            Browse Books
                        </a>
                    </div>
                `;
                return;
            }

            cartContainer.innerHTML = "";

            result.forEach(function (order) {
                const card = document.createElement("article");
                card.className = "cart-item";

                const details = document.createElement("div");
                details.className = "cart-details";

                const title = document.createElement("h3");
                title.textContent = order.bookName || "Untitled Book";

                const price = document.createElement("p");
                price.textContent = "Price: ₹" + order.price;

                const status = document.createElement("p");
                status.className = "order-status";

                if (order.status === "pending_contact") {
                    status.textContent =
                        "Order placed — contact the seller to arrange payment";
                } else if (order.status === "completed") {
                    status.textContent = "Purchase completed";
                } else if (order.status === "cancelled") {
                    status.textContent = "Order cancelled";
                } else {
                    status.textContent = "Status: " + (order.status || "Unknown");
                }

                const payment = document.createElement("p");
                payment.textContent = "Payment: In person";

                const collection = document.createElement("p");
                collection.textContent = "Collection: Contact the seller";

                details.appendChild(title);
                details.appendChild(price);
                details.appendChild(status);
                details.appendChild(payment);
                details.appendChild(collection);

                if (order.sellerName) {
                    const seller = document.createElement("p");
                    seller.textContent = "Seller: " + order.sellerName;
                    details.appendChild(seller);
                }

                if (order.sellerEmail) {
                    const sellerEmail = document.createElement("p");
                    sellerEmail.textContent =
                        "Seller email: " + order.sellerEmail;
                    details.appendChild(sellerEmail);
                }

                card.appendChild(details);
                cartContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Cart loading error:", error);

            bookCount.textContent = "Unavailable";

            cartContainer.innerHTML = `
                <div class="empty-message">
                    <h3>Could not load your orders</h3>
                    <p id="cartErrorMessage"></p>
                    <button type="button" class="shop-button"
                        onclick="location.reload()">Try Again</button>
                </div>
            `;

            const errorMessage =
                document.getElementById("cartErrorMessage");

            if (errorMessage) {
                errorMessage.textContent = error.message;
            }
        }
    }

    loadMyOrders();
});
