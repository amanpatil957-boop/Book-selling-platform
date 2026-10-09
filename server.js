
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Supports Base64 book images in JSON requests.
// Keep image files reasonably small.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve HTML, CSS, JavaScript and other frontend files
app.use(express.static(__dirname));

// Test backend
app.get("/api/health", (req, res) => {
    res.json({
        message: "Book Haven backend is running!"
    });
});

// GET: Fetch all available books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find({
            status: "available"
        }).sort({ createdAt: -1 });

        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error.message);

        res.status(500).json({
            message: "Failed to fetch books"
        });
    }
});

// POST: Add a new book to MongoDB
app.post("/api/books", async (req, res) => {
    try {
        const {
            name,
            price,
            image,
            sellerName,
            sellerEmail
        } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            !name.trim() ||
            price === undefined ||
            price === ""
        ) {
            return res.status(400).json({
                message: "Book name and price are required"
            });
        }

        const numericPrice = Number(price);

        if (
            !Number.isFinite(numericPrice) ||
            numericPrice < 0
        ) {
            return res.status(400).json({
                message: "Please enter a valid, non-negative price"
            });
        }

        // Save book in MongoDB
        const book = await Book.create({
            name: name.trim(),
            price: numericPrice,
            image: image || "",
            sellerName: sellerName || "",
            sellerEmail: sellerEmail || ""
        });

        res.status(201).json({
            message: "Book added successfully!",
            book
        });

    } catch (error) {
        console.error("Error saving book:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid book details",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Failed to save book"
        });
    }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});

// Start server after connecting to MongoDB
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is missing from your .env file"
            );
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `Book Haven running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exitCode = 1;
    }
}

startServer();