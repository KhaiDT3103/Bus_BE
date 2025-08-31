const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: String
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
