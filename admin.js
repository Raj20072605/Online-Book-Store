const loginForm = document.getElementById("admin-login-form");
const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginMessage = document.getElementById("login-message");

const addBookForm = document.getElementById("add-book-form");
const bookList = document.getElementById("book-list");
const logoutButton = document.getElementById("logout-button");

// Demo login credentials
const adminUsername = "admin";
const adminPassword = "Raj123";

// Admin Login
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (
        username === adminUsername &&
        password === adminPassword
    ) {
        loginSection.hidden = true;
        dashboard.hidden = false;
        loginMessage.textContent = "";
        showBooks();
    } else {
        loginMessage.textContent = "Invalid username or password!";
    }
});

// Get saved books
function getBooks() {
    return JSON.parse(localStorage.getItem("booknestBooks") || "[]");
}

// Display Books
function showBooks() {
    bookList.innerHTML = "";

    const books = getBooks();

    books.forEach(function(book, index) {
        const li = document.createElement("li");

        li.textContent =
            book.title + " - " +
            book.author + " - ₹" +
            book.price + " ";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteBook(index);
        });

        li.appendChild(deleteButton);
        bookList.appendChild(li);
    });
}

// Add Book
addBookForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const price = Number(document.getElementById("book-price").value);

    const books = getBooks();

    books.push({
        title: title,
        author: author,
        price: price
    });

    localStorage.setItem("booknestBooks", JSON.stringify(books));

    addBookForm.reset();
    showBooks();

    alert("Book added successfully!");
});

// Delete Book
function deleteBook(index) {
    const books = getBooks();

    books.splice(index, 1);

    localStorage.setItem("booknestBooks", JSON.stringify(books));

    showBooks();
}

// Logout
logoutButton.addEventListener("click", function() {
    dashboard.hidden = true;
    loginSection.hidden = false;
    loginForm.reset();
});

      
 
