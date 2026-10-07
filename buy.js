if (!localStorage.getItem("currentUser")) {

    alert("Please login first.");

    window.location.href = "auth.html";

}

const booksContainer =
    document.getElementById("booksContainer");

const noBooks =
    document.getElementById("noBooks");


// Load books

function displayBooks() {

    const books =
        JSON.parse(localStorage.getItem("books")) || [];


    booksContainer.innerHTML = "";


    // If there are no books

    if (books.length === 0) {

        noBooks.style.display = "block";

        return;
    }


    noBooks.style.display = "none";


    // Display every book

    books.forEach(function(book) {

        const card =
            document.createElement("div");

        card.className = "book-card";


        card.innerHTML = `

            <img
                src="${book.image}"
                alt="${book.name}"
            >

            <div class="book-details">

                <h2>
                    ${book.name}
                </h2>

                <p class="price">
                    ₹${book.price}
                </p>

                <button
                    class="buy-btn"
                    onclick="buyBook('${book.name}')">

                    Buy Now

                </button>

            </div>

        `;


        booksContainer.appendChild(card);

    });

}


// Buy button

function buyBook(bookName) {

    alert(
        "You selected: " +
        bookName +
        "\n\nThank you for choosing Book Haven!"
    );

}


// Run when page loads

displayBooks();
