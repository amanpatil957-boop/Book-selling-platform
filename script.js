function openPortal() {

    document.getElementById("portal").style.display = "flex";

}


function closePortal() {

    document.getElementById("portal").style.display = "none";

}


function buyBooks() {

    closePortal();

    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });

}


function sellBooks() {
    window.location.href = "sell.html";
}



function buyBook(bookName) {

    alert(
        "You selected: " +
        bookName +
        "\n\nThank you for using BookLoop!"
    );

}
