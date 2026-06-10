const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config(); // In case they use a .env file

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://chulbhullohani_db_user:Chulbul%402004@cluster0.igizlt9.mongodb.net/luxe_ecommerce?retryWrites=true&w=majority";

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const adminExists = await User.findOne({ email: "admin@luxe.com" });
        if (adminExists) {
            console.log("Admin user already exists.");
            process.exit();
        }

        const adminUser = await User.create({
            name: "Super Admin",
            email: "admin@luxe.com",
            password: "admin123", // Will be hashed by pre-save hook
            isAdmin: true
        });

        if (adminUser) {
            console.log("Admin User Created Successfully!");
            console.log("Email: admin@luxe.com");
            console.log("Password: admin123");
        }

        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
