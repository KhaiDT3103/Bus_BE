const mongoose = require('mongoose');
const Schemas = mongoose.Schema;

const userSchema = new Schemas({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);