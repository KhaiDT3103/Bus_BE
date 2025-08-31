const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
    routeId: {
        type: Schema.Types.ObjectId,
        ref: 'BusRoutes',
        required: true
    },
    busId: {
        type: Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    ticketCode: {
        type: String,
        required: true,
        unique: true
    },
    seatNumber: {
        type: Number
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed'],
        default: 'booked'
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
    travelDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
