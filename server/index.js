const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

const User = require("./models/User");
const Cart = require("./models/Cart");
const Product = require("./models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_change_me";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Auth Middleware
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    }
    if (!token) {
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

// Admin Middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ success: false, message: "Not authorized as an admin" });
    }
};

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Auth Routes (Signup, OTP Verification, Login, Forgot & Reset Password)
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

// Get User Cart
app.get("/api/cart", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        res.json({ success: true, cart: cart ? cart.items : [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Sync Cart (Add/Update/Remove)
app.post("/api/cart/sync", protect, async (req, res) => {
    const { items } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = items;
            await cart.save();
        } else {
            cart = await Cart.create({
                user: req.user._id,
                items
            });
        }
        res.json({ success: true, cart: cart.items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- Product Routes ---

// Get all products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json({ success: true, product });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create product (Admin only)
app.post("/api/products", protect, admin, async (req, res) => {
    const { name, price, description, image, category, countInStock, originalPrice, discount, tag } = req.body;
    try {
        const product = new Product({
            name, price, description, image, category, countInStock, originalPrice, discount, tag
        });
        const createdProduct = await product.save();
        res.status(201).json({ success: true, product: createdProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update product (Admin only)
app.put("/api/products/:id", protect, admin, async (req, res) => {
    const { name, price, description, image, category, countInStock, originalPrice, discount, tag } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            product.originalPrice = originalPrice || product.originalPrice;
            product.discount = discount || product.discount;
            product.tag = tag || product.tag;

            const updatedProduct = await product.save();
            res.json({ success: true, product: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete product (Admin only)
app.delete("/api/products/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ success: true, message: "Product removed" });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin Dashboard Stats
app.get("/api/admin/stats", protect, admin, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        const userCount = await User.countDocuments();
        // Assuming we might have orders in the future, if not just return counts
        res.json({
            success: true,
            stats: {
                products: productCount,
                users: userCount,
                orders: 0 // Placeholder
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin - Get all users
app.get("/api/admin/users", protect, admin, async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password -resetPasswordToken -resetPasswordExpires")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin - Update user role
app.put("/api/admin/users/:id/role", protect, admin, async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent accidental removal of own admin role.
        if (req.user._id.toString() === user._id.toString() && isAdmin === false) {
            return res.status(400).json({ success: false, message: "You cannot remove your own admin access" });
        }

        user.isAdmin = Boolean(isAdmin);
        await user.save();

        res.json({
            success: true,
            message: "User role updated",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin - Delete user
app.delete("/api/admin/users/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent deleting currently logged-in admin account.
        if (req.user._id.toString() === user._id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot delete your own account" });
        }

        await user.deleteOne();
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- User Profile Routes ---

// Get User Profile
app.get("/api/user/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update User Profile
app.put("/api/user/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;

            if (req.body.address) {
                user.address.street = req.body.address.street || user.address.street;
                user.address.city = req.body.address.city || user.address.city;
                user.address.state = req.body.address.state || user.address.state;
                user.address.pinCode = req.body.address.pinCode || user.address.pinCode;
            }

            if (req.body.bankDetails) {
                user.bankDetails.accountHolder = req.body.bankDetails.accountHolder || user.bankDetails.accountHolder;
                user.bankDetails.accountNumber = req.body.bankDetails.accountNumber || user.bankDetails.accountNumber;
                user.bankDetails.ifscCode = req.body.bankDetails.ifscCode || user.bankDetails.ifscCode;
                user.bankDetails.bankName = req.body.bankDetails.bankName || user.bankDetails.bankName;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                phone: updatedUser.phone,
                address: updatedUser.address,
                bankDetails: updatedUser.bankDetails,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});