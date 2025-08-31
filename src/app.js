const express = require('express');
const connectDB = require('../src/config/db.js');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json({ limit: '1mb' })); // hoặc lớn hơn nếu cần

app.use(cors());
// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());

//Khai bao Routes
const userRoutes = require('../src/routes/userRoutes.js');
const stopRoutes = require('../src/routes/stopsRoutes.js');
const busRoutesRoutes = require('../src/routes/busRoutesRoutes.js');
// Route mẫu
app.get('/', (req, res) => {
    res.send('Hello from Express + MongoDB!');
});
//Routes User
app.use("/api/user", userRoutes);

//Routes Stop
app.use("/api/stop", stopRoutes);

//Routes BusRoutes
app.use("/api/busroutes", busRoutesRoutes);

module.exports = app;