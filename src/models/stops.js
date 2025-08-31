const mongoose = require('mongoose');
const { Schema } = mongoose;

const stopSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    routes: [{
        type: String,
        trim: true // loại bỏ khoảng trắng đầu/cuối nếu có
    }],
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    stopCode: {
        type: String,
        unique: true,
        sparse: true // Cho phép null nhưng vẫn unique nếu có
    }
}, { timestamps: true });

module.exports = mongoose.model('Stop', stopSchema);
