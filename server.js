const express = require("express");
const cors = require("cors");
const app = express();

// เปิดให้ Frontend (พอร์ต 5173 หรืออื่นๆ) เข้าถึงได้
app.use(cors());
app.use(express.json());

// นำเข้า Route ต่างๆ
const authRoute = require("./src/routes/auth.route");

// เรียกใช้งาน Route
app.use("/api/auth", authRoute);

// หน้าแรกกัน API พัง
app.get("/", (req, res) => {
  res.send("Pearl Dental Care API is running...");
});

// กำหนดพอร์ต
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});