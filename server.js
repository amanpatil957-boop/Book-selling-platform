const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Book = require("./models/Book");
const Order = require("./models/Order");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve frontend HTML, CSS, JavaScript and images
app.use(express.static(__dirname));

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {
    res.json({
        message: "Book Haven backend is running!"
    });
});

// ========================================
// GET: FETCH AVAILABLE BOOKS
// ========================================

app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find({
            status: "available"
        }).sort({ createdAt: -1 });

        return res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);

        return res.status(500).json({
            message: "Failed to fetch books"
        });
    }
});

// ========================================
// POST: ADD A BOOK FOR SALE
// ========================================

app.post("/api/books", async (req, res) => {
    try {
        const {
            name,
            price,
            image,
            sellerName,
            sellerEmail
        } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Book name is required"
            });
        }

        if (price === undefined || price === null || price === "") {
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

        if (
            (image !== undefined && typeof image !== "string") ||
            (sellerName !== undefined && typeof sellerName !== "string") ||
            (sellerEmail !== undefined && typeof sellerEmail !== "string")
        ) {
            return res.status(400).json({
                message: "Image and seller details must be text"
            });
        }

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
        console.error("Error saving book:", error);

        if (error.name === "ValidationError") {
    return res.status(400).json({
        message: "Invalid order details: " + error.message
    });
}

        return res.status(500).json({
            message: "Failed to save book"
        });
    }
});

// ========================================
// POST: PLACE AN ORDER
// Payment: In person
// Collection: Contact the seller
// ========================================

app.post("/api/orders", async (req, res) => {
    let reservedBookId = null;

    try {
        const {
            bookId,
            buyerName,
            buyerEmail,
            buyerPhone
        } = req.body;

        // Validate buyer details
        if (
            typeof bookId !== "string" ||
            !bookId ||
            typeof buyerName !== "string" ||
            !buyerName.trim() ||
            typeof buyerEmail !== "string" ||
            !buyerEmail.trim() ||
            typeof buyerPhone !== "string" ||
            !buyerPhone.trim()
        ) {
            return res.status(400).json({
                message: "Please provide all buyer details."
            });
        }

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).json({
                message: "Invalid book ID."
            });
        }

        const email = buyerEmail.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        // Reserve only if the book is still available.
        // This prevents two requests from reserving the same book.
        const book = await Book.findOneAndUpdate(
            {
                _id: bookId,
                status: "available"
            },
            {
                $set: { status: "reserved" }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {
            return res.status(409).json({
                message: "This book is no longer available."
            });
        }

        reservedBookId = book._id;

        // Save the order in MongoDB
        const order = await Order.create({
            book: book._id,
            bookName: book.name,
            price: book.price,

            buyerName: buyerName.trim(),
            buyerEmail: email,
            buyerPhone: buyerPhone.trim(),

            sellerName: book.sellerName || "",
            sellerEmail: book.sellerEmail || "",

            paymentMethod: "pay-in-person",
            deliveryMethod: "seller-collection",
            status: "pending_contact"
        });

        return res.status(201).json({
            message: "Order request created successfully!",
            order: {
                id: order._id,
                bookName: order.bookName,
                price: order.price,
                buyerName: order.buyerName,
                sellerName: order.sellerName,
                sellerEmail: order.sellerEmail,
                status: order.status,
                paymentMethod: order.paymentMethod,
                deliveryMethod: order.deliveryMethod
            }
        });
    } catch (error) {
        console.error("Error creating order:", error);

        // If order creation fails, try to release the reservation.
        if (reservedBookId) {
            try {
                await Book.updateOne(
                    {
                        _id: reservedBookId,
                        status: "reserved"
                    },
                    {
                        $set: { status: "available" }
                    }
                );
            } catch (releaseError) {
                console.error(
                    "Failed to release book reservation:",
                    releaseError
                );
            }
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid order details.",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Could not place your order. Please try again."
        });
    }
});

// ========================================
// HANDLE UNKNOWN API ROUTES
// Keep this AFTER all API routes
// ========================================

app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found"
    });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            message: "Invalid JSON request body"
        });
    }

    console.error("Unexpected server error:", error);

    return res.status(500).json({
        message: "Internal server error"
    });
});

// ========================================
// CONNECT TO MONGODB AND START SERVER
// ========================================

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