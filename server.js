require("dotenv").config();
const express = require("express");
const cors = require("cors");

// 1. Import Routes เข้ามา
const appointmentRoutes = require("./src/routes/appointment.route");
const authRoutes = require("./src/routes/auth.route");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 2. ผูก Route เข้ากับ Prefix /api
app.use("/api", appointmentRoutes);
app.use("/api", authRoutes); // <--- จุดสำคัญที่ทำให้เข้าถึง /api/auth/register ได้

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});