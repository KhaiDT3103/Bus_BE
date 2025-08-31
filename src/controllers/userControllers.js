const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find(); // ← đúng cách
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email đã tồn tại' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo user mới
        const newUser = new User({ name, email, password: hashedPassword, phone, role });
        await newUser.save();

        res.status(201).json({ message: 'Thêm user thành công', user: newUser });
    } catch (error) {
        console.error('❌ Lỗi khi thêm user:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        // Nếu thành công
        res.json({
            message: 'Đăng nhập thành công', token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};