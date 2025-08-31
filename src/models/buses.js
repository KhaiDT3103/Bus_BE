const mongoose = require('mongoose');
const { Schema } = mongoose;

const busSchema = new Schema({
    licensePlate: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'Driver', // Tên model driver
        required: true
    },
    routeId: {
        type: Schema.Types.ObjectId,
        ref: 'BusRoute', // Tên model tuyến xe buýt
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'maintenance', 'busy'],
        default: 'available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
