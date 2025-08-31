const app = require("./src/app");
require("dotenv").config();
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    serverStarted = true;
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});

// const axios = require('axios');
// require('../BE/src/config/db');
// const Stop = require('../BE/src/models/stops');

// async function fetchAndSaveStops() {
//     try {
//         const res = await axios.get('http://apicms.ebms.vn/businfo/getstopsbyvar/1/1');
//         const stopsArray = res.data;

//         // Lấy danh sách stopCode hiện có trong DB
//         const existingCodes = await Stop.find({}, 'stopCode');
//         const existingSet = new Set(existingCodes.map(s => s.stopCode));

//         // Chuyển đổi và lọc trùng
//         const transformed = stopsArray
//             .map(stop => ({
//                 name: stop.Name,
//                 routes: stop.Routes ? stop.Routes.split(',').map(r => r.trim()) : [],
//                 location: {
//                     lat: parseFloat(stop.Lat),
//                     lng: parseFloat(stop.Lng)
//                 },
//                 stopCode: stop.Code || null
//             }))
//             .filter(stop => stop.stopCode && !existingSet.has(stop.stopCode)) // bỏ stopCode trùng DB
//             .filter((stop, index, self) => // bỏ trùng trong batch hiện tại
//                 index === self.findIndex(s => s.stopCode === stop.stopCode)
//             );

//         if (transformed.length > 0) {
//             await Stop.insertMany(transformed, { ordered: false });
//             console.log(`✅ Đã lưu ${transformed.length} điểm dừng mới vào MongoDB`);
//         } else {
//             console.log('ℹ️ Không có điểm dừng mới để lưu');
//         }
//     } catch (error) {
//         console.error('❌ Lỗi khi lấy hoặc lưu dữ liệu:', error.message);
//     }
// }

// fetchAndSaveStops();

