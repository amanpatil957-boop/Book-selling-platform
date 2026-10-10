
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Supports Base64 images in JSON requests.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve frontend files: HTML, CSS, JavaScript, images
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

        res.status(200).json(books);
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

        // Validate book name
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Book name is required"
            });
        }

        // Validate price
        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return res.status(400).json({
                message: "Book price is required"
            });
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "Please enter a valid, non-negative price"
            });
        }

        // Validate optional text fields
        if (
            (image !== undefined && typeof image !== "string") ||
            (sellerName !== undefined && typeof sellerName !== "string") ||
            (sellerEmail !== undefined && typeof sellerEmail !== "string")
        ) {
            return res.status(400).json({
                message: "Image and seller details must be text"
            });
        }

        // Create and save book
        const book = await Book.create({
            name: name.trim(),
            price: numericPrice,
            image: image || "",
            sellerName: sellerName || "",
            sellerEmail: sellerEmail || "",
            status: "available"
        });

        return res.status(201).json({
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

        return res.status(500).json({
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

// Handle invalid JSON requests
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            message: "Invalid JSON request body"
        });
    }

    next(error);
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
