let selectedImage = "";


/* OPEN FORM */

function openForm() {

    document
        .getElementById("sellForm")
        .classList.add("show");

}


/* CLOSE FORM */

function closeForm() {

    document
        .getElementById("sellForm")
        .classList.remove("show");

}


/* IMAGE PREVIEW */

document
    .getElementById("bookImage")
    .addEventListener("change", function(event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {

            selectedImage = e.target.result;

            document
                .getElementById("imagePreview")
                .innerHTML =
                `<img src="${selectedImage}">`;

        };

        reader.readAsDataURL(file);

    });


/* ADD BOOK */

function addBook() {

    const name =
        document
            .getElementById("bookName")
            .value
            .trim();


    const author =
        document
            .getElementById("bookAuthor")
            .value
            .trim();


    const price =
        document
            .getElementById("bookPrice")
            .value
            .trim();


    const description =
        document
            .getElementById("bookDescription")
            .value
            .trim();


    if (
        name === "" ||
        author === "" ||
        price === "" ||
        description === ""
    ) {

        alert("Please fill in all the information.");

        return;

    }


    if (selectedImage === "") {

        alert("Please upload an image of your book.");

        return;

    }


    const bookList =
        document.getElementById("bookList");


    const emptyMessage =
        document.getElementById("emptyMessage");


    if (emptyMessage) {
        emptyMessage.remove();
    }


    const card =
        document.createElement("div");

    card.className = "book-card";


    card.innerHTML = `

        <img src="${selectedImage}">

        <div class="book-info">

            <h3>${name}</h3>

            <p class="book-author">
                Author: ${author}
            </p>

            <p class="book-price">
                ₹${price}
            </p>

            <p class="book-description">
                ${description}
            </p>

        </div>

    `;


    bookList.appendChild(card);


    /* CLEAR FORM */

    document
        .getElementById("bookName")
        .value = "";

    document
        .getElementById("bookAuthor")
        .value = "";

    document
        .getElementById("bookPrice")
        .value = "";

    document
        .getElementById("bookDescription")
        .value = "";

    document
        .getElementById("bookImage")
        .value = "";

    document
        .getElementById("imagePreview")
        .innerHTML = "";

    selectedImage = "";


    closeForm();


    alert("Your book has been listed successfully! 📚");

}
