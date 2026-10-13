const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        bookName: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        buyerName: {
            type: String,
            required: true,
            trim: true
        },

        buyerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        buyerPhone: {
            type: String,
            required: true,
            trim: true
        },

        sellerName: {
            type: String,
            default: ""
        },

        sellerEmail: {
            type: String,
            default: ""
        },

        paymentMethod: {
            type: String,
            enum: ["pay-in-person"],
            default: "pay-in-person"
        },

        deliveryMethod: {
            type: String,
            enum: ["seller-collection"],
            default: "seller-collection"
        },

        status: {
            type: String,
            enum: ["pending_contact", "completed", "cancelled"],
            default: "pending_contact"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);