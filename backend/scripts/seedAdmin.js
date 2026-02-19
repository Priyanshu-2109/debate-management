const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");
require("dotenv").config();

const seedAdmin = async () => {
  await connectDB();

  const existingAdmin = await Admin.findOne({ email: "admin@debate.com" });
  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const admin = await Admin.create({
    email: "admin@debate.com",
    password: "admin123456",
    name: "Super Admin",
  });

  console.log(`Admin created: ${admin.email}`);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
