const Stop = require('../models/stops');
const BusRoutes = require('../models/bus_routes');
const mongoose = require('mongoose');
exports.addStop = async (req, res) => {
    try {
        const { name, location, stopCode } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!name || !location || location.lat == null || location.lng == null) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc: tên hoặc toạ độ" });
        }

        // Tạo đối tượng mới
        const newStop = new Stop({
            name,
            location,
            stopCode
        });

        // Lưu vào MongoDB
        const savedStop = await newStop.save();
        res.status(201).json({ message: "✅ Thêm điểm dừng thành công", stop: savedStop });
    } catch (error) {
        console.error("❌ Lỗi khi thêm điểm dừng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi máy chủ", error: error.message });
    }
};

exports.addMultipleStops = async (req, res) => {
    try {
        const stopsToAdd = req.body; // req.body sẽ là một mảng các đối tượng điểm dừng

        // Kiểm tra xem dữ liệu gửi lên có phải là mảng không
        if (!Array.isArray(stopsToAdd) || stopsToAdd.length === 0) {
            return res.status(400).json({ message: "Dữ liệu gửi lên phải là một mảng các điểm dừng và không được rỗng." });
        }

        // Kiểm tra từng đối tượng trong mảng và loại bỏ những đối tượng không hợp lệ (tùy chọn)
        const validStops = stopsToAdd.filter(stop =>
            stop.name && stop.location && stop.location.lat != null && stop.location.lng != null
        );

        if (validStops.length === 0) {
            return res.status(400).json({ message: "Không có điểm dừng hợp lệ nào trong yêu cầu." });
        }

        // Sử dụng insertMany để thêm nhiều bản ghi vào MongoDB cùng lúc
        const savedStops = await Stop.insertMany(validStops);

        res.status(201).json({
            message: `✅ Thêm thành công ${savedStops.length} điểm dừng.`,
            stops: savedStops
        });
    } catch (error) {
        console.error("❌ Lỗi khi thêm nhiều điểm dừng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi máy chủ", error: error.message });
    }
};
exports.getAllStops = async (req, res) => {
    try {
        const stops = await Stop.find(); // ← đúng cách
        res.status(200).json(stops);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


exports.addRouteToAllStops = async (req, res) => {

    try {
        const routeId = '688f95aa1ffea493f5e475c4'; // hoặc lấy từ req.body nếu cần linh hoạt

        const result = await Stop.updateMany(
            {},
            { $addToSet: { routes: routeId } } // Thêm routeId nếu chưa có
        );
        res.status(200).json({
            message: 'Đã thêm route vào tất cả trạm thành công',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật các trạm:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};
exports.getDuplicateNames = async (req, res) => {
    try {
        const duplicates = await Stop.aggregate([
            {
                $match: {
                    name: { $ne: null } // bỏ những cái null
                }
            },
            {
                $group: {
                    _id: "$name",
                    count: { $sum: 1 },
                    stops: { $push: "$$ROOT" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        res.status(200).json({
            message: 'Các trạm có name trùng nhau',
            data: duplicates
        });
    } catch (error) {
        console.error('❌ Lỗi khi lấy name trùng:', error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
exports.getStopsByRoutesID = async (req, res) => {
    try {
        // lấy routeNumber từ params
        const routeNumber = req.params.routeNumber;
        if (!routeNumber || routeNumber.trim() === "") {
            return res.status(400).json({
                message: "routeNumber không được để trống"
            });
        }
        // Tìm tuyến xe theo routeNumber và populate stopIds
        const route = await BusRoutes.findOne({ routeNumber })
            .populate('stopIds'); // populate để lấy thông tin chi tiết từ Stop

        if (!route) {
            return res.status(404).json({
                message: "Không tìm thấy tuyến xe"
            });
        }

        // Trả về danh sách các stops
        return res.status(200).json({
            routeNumber: route.routeNumber,
            name: route.name,
            stops: route.stopIds // đã là object Stop do populate
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};
exports.deleteStopById = async (req, res) => {
    try {
        const { id } = req.params;

        // kiểm tra id hợp lệ trước khi query
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "ID không hợp lệ hoặc rỗng"
            });
        }

        const deletedStop = await Stop.findByIdAndDelete(id);

        if (!deletedStop) {
            return res.status(404).json({
                message: "Không tìm thấy trạm cần xoá"
            });
        }

        return res.status(200).json({
            message: "Xoá trạm thành công",
            stop: deletedStop
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};