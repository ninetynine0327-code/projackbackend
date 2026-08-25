require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.route");
const userRoutes = require("./src/routes/user.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Dental Clinic API พร้อมใช้งาน" });
});

app.listen(PORT, () => {
  console.log(`Server ทำงานที่ http://localhost:${PORT}`);
});