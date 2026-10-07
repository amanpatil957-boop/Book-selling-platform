```javascript
/* =========================
   SHOW LOGIN
========================= */

function showLogin() {

    document.getElementById("loginSection").style.display =
        "block";

    document.getElementById("signupSection").style.display =
        "none";
}


/* =========================
   SHOW SIGNUP
========================= */

function showSignup() {

    document.getElementById("loginSection").style.display =
        "none";

    document.getElementById("signupSection").style.display =
        "block";
}


/* =========================
   SIGNUP
========================= */

const signupForm =
    document.getElementById("signupForm");


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


    /* Check password */

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    /* Get existing users */

    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    /* Check existing email */

    const existingUser =
        users.find(function(user) {

            return user.email === email;

        });


    if (existingUser) {

        alert("An account with this email already exists.");

        return;
    }


    /* Create user */

    const user = {

        id: Date.now(),

        name: name,

        email: email,

        password: password

    };


    users.push(user);


    /* Save users */

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert(
        "Account created successfully! Please login."
    );


    signupForm.reset();


    showLogin();

});



/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value
        .trim()
        .toLowerCase();


    const password =
        document.getElementById("loginPassword").value;


    /* Get users */

    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    /* Find user */

    const user =
        users.find(function(user) {

            return user.email === email &&
                   user.password === password;

        });


    if (!user) {

        alert(
            "Invalid email or password."
        );

        return;
    }


    /* Save logged-in user */

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    alert(
        "Login successful! Welcome " +
        user.name
    );


    /* Go to home */

    window.location.href = "index.html";

});
```
