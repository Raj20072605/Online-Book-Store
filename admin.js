// BookNest Admin Panel

let books = JSON.parse(localStorage.getItem("booknestBooks")) || [];

const bookForm = document.getElementById("bookForm");
const bookTable = document.getElementById("bookTable");
const totalBooks = document.getElementById("totalBooks");

let editIndex = -1;

// Display all books
function displayBooks() {
    bookTable.innerHTML = "";

    books.forEach(function(book, index) {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;

        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;

        const priceCell = document.createElement("td");
        priceCell.textContent = "₹" + Number(book.price).toFixed(2);

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", function() {
            editBook(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", function() {
            deleteBook(index);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(titleCell);
        row.appendChild(authorCell);
        row.appendChild(priceCell);
        row.appendChild(actionCell);

        bookTable.appendChild(row);
    });

    totalBooks.textContent = books.length;
}

// Save books in browser storage
function saveBooks() {
    localStorage.setItem("booknestBooks", JSON.stringify(books));
}

// Add or update a book
bookForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("bookTitle").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const price = Number(document.getElementById("bookPrice").value);

    if (!title || !author || !Number.isFinite(price) || price <= 0) {
        alert("Please enter valid book details and a price greater than zero.");
        return;
    }

    const book = {
        title: title,
        author: author,
        price: price
    };

    if (editIndex === -1) {
        books.push(book);
        alert("Book added successfully!");
    } else {
        books[editIndex] = book;
        editIndex = -1;
        bookForm.querySelector('button[type="submit"]').textContent = "Add Book";
        alert("Book updated successfully!");
    }

    saveBooks();
    displayBooks();
    bookForm.reset();
});

// Edit book
function editBook(index) {
    document.getElementById("bookTitle").value = books[index].title;
    document.getElementById("bookAuthor").value = books[index].author;
    document.getElementById("bookPrice").value = books[index].price;

    editIndex = index;
    bookForm.querySelector('button[type="submit"]').textContent = "Update Book";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete book
function deleteBook(index) {
    if (confirm("Are you sure you want to delete this book?")) {
        books.splice(index, 1);

        if (editIndex === index) {
            editIndex = -1;
            bookForm.reset();
            bookForm.querySelector('button[type="submit"]').textContent = "Add Book";
        } else if (editIndex > index) {
            editIndex--;
        }

        saveBooks();
        displayBooks();
        alert("Book deleted successfully!");
    }
}

// Demo logout
function logout() {
    window.location.href = "admin-login.html";
}

// Show books when the page opens
displayBooks();
