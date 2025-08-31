const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const busRoutesSchema = new Schema({
    routeNumber: String,
    name: String,
    startStop: String,
    endStop: String,
    stopIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Stop' // Tên model của collection stops
    }],
    distanceKm: Number,
    durationMinutes: Number,
    price: Number,
    isActive: Boolean
}, { timestamps: true });
module.exports = mongoose.model('BusRoutes', busRoutesSchema);