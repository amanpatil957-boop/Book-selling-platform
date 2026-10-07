console.log("AUTH JS LOADED");


// ===============================
// SHOW SIGN UP
// ===============================

function showSignup() {

    document.getElementById("loginSection").style.display = "none";

    document.getElementById("signupSection").style.display = "block";
}


// ===============================
// SHOW LOGIN
// ===============================

function showLogin() {

    document.getElementById("signupSection").style.display = "none";

    document.getElementById("loginSection").style.display = "block";
}


// ===============================
// SIGN UP
// ===============================

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check passwords

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    // Get existing users

    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    // Check if email already exists

    const existingUser = users.find(function(user) {

        return user.email === email;

    });


    if (existingUser) {

        alert("This email is already registered.");

        return;
    }


    // Create new user

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password

    };


    // Save user

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert("Account created successfully!");


    // Clear signup form

    signupForm.reset();


    // Show login

    showLogin();

});


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    // Get registered users

    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    // Find matching user

    const user = users.find(function(user) {

        return (
            user.email === email &&
            user.password === password
        );

    });


    // User not found

    if (!user) {

        alert("Invalid email or password.");

        return;
    }


    // Save logged-in user

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    alert(
        "Login successful! Welcome " + user.name
    );


    // Go to home page

    window.location.href = "index.html";

});