import mongoose from "mongoose";

const farm2Schema = new mongoose.Schema({
    fullName: { type: String, required: true },
    walletAddress: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const Farm2 = mongoose.models.Farm2 || mongoose.model('Farm2', farm2Schema);

export default Farm2;