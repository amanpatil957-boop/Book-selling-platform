/* GET BOOKS FROM LOCAL STORAGE */

const books =
    JSON.parse(
        localStorage.getItem("bookloopBooks")
    ) || [];


const bookList =
    document.getElementById("bookList");


const noBooks =
    document.getElementById("noBooks");


/* SHOW BOOKS */

function displayBooks() {

    bookList.innerHTML = "";


    if (books.length === 0) {

        noBooks.style.display = "block";

        return;

    }


    noBooks.style.display = "none";


    books.forEach(function(book, index) {

        const card =
            document.createElement("div");

        card.className = "book-card";


        card.innerHTML = `

            <img
                src="${book.image}"
                alt="${book.name}"
            >

            <div class="book-info">

                <h2>
                    ${book.name}
                </h2>

                <p class="author">
                    Author: ${book.author}
                </p>

                <p class="description">
                    ${book.description}
                </p>

                <div class="price">
                    ₹${book.price}
                </div>

                <button
                    class="buy-button"
                    onclick="buyNow(${index})"
                >
                    🛒 Buy Now
                </button>

            </div>

        `;


        bookList.appendChild(card);

    });

}


/* BUY NOW */

function buyNow(index) {

    const book = books[index];


    alert(
        "You selected:\n\n" +
        book.name +
        "\n\nPrice: ₹" +
        book.price +
        "\n\nThe seller can contact you to complete the purchase."
    );

}


displayBooks();
