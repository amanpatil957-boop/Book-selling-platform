const bookForm = document.getElementById("bookForm");


// When form is submitted

bookForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const bookName =
        document.getElementById("bookName").value;

    const bookPrice =
        document.getElementById("bookPrice").value;

    const imageInput =
        document.getElementById("bookImage");


    // Make sure image exists

    if (imageInput.files.length === 0) {

        alert("Please select a book image.");

        return;
    }


    const imageFile = imageInput.files[0];


    // Convert image to Base64

    const reader = new FileReader();


    reader.onload = function() {

        const book = {

            id: Date.now(),

            name: bookName,

            price: bookPrice,

            image: reader.result

        };


        // Get existing books

        let books =
            JSON.parse(localStorage.getItem("books")) || [];


        // Add new book

        books.push(book);


        // Save books

        localStorage.setItem(
            "books",
            JSON.stringify(books)
        );


        alert("Book added successfully!");


        // Reset form

        bookForm.reset();


        // Display seller's books

        displaySellerBooks();

    };


    reader.readAsDataURL(imageFile);

});



/* Display books on seller page */

function displaySellerBooks() {

    const sellerBooks =
        document.getElementById("sellerBooks");


    const books =
        JSON.parse(localStorage.getItem("books")) || [];


    sellerBooks.innerHTML = "";


    if (books.length === 0) {

        sellerBooks.innerHTML =
            "<p>No books listed yet.</p>";

        return;
    }


    books.forEach(function(book) {

        const card =
            document.createElement("div");

        card.className =
            "seller-book-card";


        card.innerHTML = `

            <img src="${book.image}" alt="${book.name}">

            <div class="book-info">

                <h3>${book.name}</h3>

                <p>₹${book.price}</p>

            </div>

        `;


        sellerBooks.appendChild(card);

    });

}


// Load books when page opens

displaySellerBooks();
