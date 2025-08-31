const busRoutes = require('../models/bus_routes');
const Stop = require('../models/stops');
exports.addBusRoutes = async (req, res) => {
    try {
        const { routeNumber, name, startStop, endStop, stopIds, distanceKm, durationMinutes, price, isActive } = req.body;
        if (!routeNumber || !name || !startStop || !endStop || !Array.isArray(stopIds)) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        }
        const newRoute = new busRoutes({
            routeNumber,
            name,
            startStop,
            endStop,
            stopIds,
            distanceKm,
            durationMinutes,
            price,
            isActive
        });
        const saveRoute = await newRoute.save();
        res.status(201).json({
            message: 'Thêm tuyến thành công',
            data: saveRoute
        });
    } catch (error) {
        console.error('Lỗi khi thêm tuyến xe buýt:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi thêm tuyến xe buýt.', error });
    }
};
exports.getAllBusRoutes = async (req, res) => {
    try {
        const BusRoutesList = await busRoutes.find().populate('stopIds');
        res.status(200).json(BusRoutesList);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

exports.getRouteInfoByID = async (req, res) => {
    try {
        const route = await busRoutes.findById(req.params.route_id).populate('stopIds');
        if (!route) return res.status(404).json({ message: 'Không tìm thấy tuyến' });
        res.json(route);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

exports.searchBusRoutes = async (req, res) => {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({ message: 'Thiếu tham số from hoặc to' });
        }

        // Tìm stop theo stopCode
        const fromStop = await Stop.findOne({ stopCode: from.trim() });
        const toStop = await Stop.findOne({ stopCode: to.trim() });

        if (!fromStop || !toStop) {
            return res.status(404).json({ message: 'Không tìm thấy trạm dừng tương ứng' });
        }

        // Tìm các tuyến chứa cả hai trạm
        const routes = await busRoutes.find({
            stopIds: { $all: [fromStop._id, toStop._id] },
            isActive: true
        }).populate('stopIds'); // nếu bạn muốn trả thêm thông tin trạm

        res.status(200).json({
            count: routes.length,
            routes
        });

    } catch (err) {
        console.error("Lỗi tìm tuyến theo stopCode:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};
exports.updateBusRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;


        // Kiểm tra dữ liệu đầu vào nếu cần
        if (!updatedData || !Array.isArray(updatedData.stopIds)) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }

        // Cập nhật
        const updatedRoute = await busRoutes.findByIdAndUpdate(
            id,
            {
                $set: {
                    routeNumber: updatedData.routeNumber,
                    name: updatedData.name,
                    startStop: updatedData.startStop,
                    endStop: updatedData.endStop,
                    distanceKm: updatedData.distanceKm,
                    durationMinutes: updatedData.durationMinutes,
                    price: updatedData.price,
                    isActive: updatedData.isActive,
                    stopIds: updatedData.stopIds, // Thay thế toàn bộ mảng stopIds
                }
            },
            { new: true } // Trả về document mới sau khi cập nhật
        ).populate('stopIds');

        if (!updatedRoute) {
            return res.status(404).json({ message: 'Không tìm thấy tuyến xe' });
        }

        res.json(updatedRoute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
exports.deleteBusRoute = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRoute = await busRoutes.findByIdAndDelete(id);

        if (!deletedRoute) {
            return res.status(404).json({ message: "Không tìm thấy tuyến xe" });
        }

        res.status(200).json({
            message: "Xóa tuyến thành công",
            data: deletedRoute
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa tuyến:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};