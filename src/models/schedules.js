const mongoose = require('mongoose');
const Schemas = mongoose.Schema;

const scheduleSchema = new Schemas({
    routeId: {
        type: Schema.Types.ObjectId,
        ref: 'BusRoutes', // Tên model tuyến xe buýt (busRoutes)
        required: true
    },
    busId: {
        type: Schema.Types.ObjectId,
        ref: 'Bus', // Tên model xe buýt (buses)
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    frequencyMinutes: {
        type: Number
    },
    weekdaysOnly: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
module.exports = mongoose.model('Schedule', scheduleSchema);