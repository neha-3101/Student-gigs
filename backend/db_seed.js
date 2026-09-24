const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userModel = require("./src/models/auth.model");
const gigModel = require("./src/models/creategig.model");
const ServiceRequest = require("./src/models/serviceRequest.model");
const Message = require("./src/models/message.model");

async function run() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database.");

    // Clean existing data
    console.log("Clearing existing service requests and messages...");
    await ServiceRequest.deleteMany({});
    await Message.deleteMany({});
    console.log("Cleared.");

    // Ensure we have User A, User B, User C
    const passHash = await bcrypt.hash("password123", 10);
    
    // User A: provider@test.com
    let userA = await userModel.findOne({ email: "provider@test.com" });
    if (!userA) {
      userA = await userModel.create({
        name: "Rahul Verma",
        email: "provider@test.com",
        password: passHash,
      });
      console.log("Created User A: Rahul Verma (provider@test.com)");
    } else {
      console.log("User A already exists.");
    }

    // User B: client@test.com
    let userB = await userModel.findOne({ email: "client@test.com" });
    if (!userB) {
      userB = await userModel.create({
        name: "Kamlesh Patel",
        email: "client@test.com",
        password: passHash,
      });
      console.log("Created User B: Kamlesh Patel (client@test.com)");
    } else {
      console.log("User B already exists.");
    }

    // User C: other@test.com
    let userC = await userModel.findOne({ email: "other@test.com" });
    if (!userC) {
      userC = await userModel.create({
        name: "Other Student",
        email: "other@test.com",
        password: passHash,
      });
      console.log("Created User C: Other Student (other@test.com)");
    } else {
      console.log("User C already exists.");
    }

    // Clear and create a clean Gig owned by User A
    console.log("Recreating clean gigs for User A...");
    await gigModel.deleteMany({ email: "provider@test.com" });
    const gigA = await gigModel.create({
      title: "Java Tutoring",
      price: 500,
      description: "Learn core Java and OOP principles from scratch. 1-on-1 tutoring.",
      category: "Teaching",
      name: userA.name,
      email: userA.email,
      phone: 9876543210,
      profilePicture: "",
    });
    console.log("Created Gig A for User A: Java Tutoring");

    // Also let's create a Coding gig for User A
    const gigB = await gigModel.create({
      title: "React Web App",
      price: 3000,
      description: "Build a single page React application with premium styles.",
      category: "Coding",
      name: userA.name,
      email: userA.email,
      phone: 9876543210,
      profilePicture: "",
    });
    console.log("Created Gig B for User A: React Web App");

    console.log("Seeding process completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

run();
