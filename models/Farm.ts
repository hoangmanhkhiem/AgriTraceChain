import mongoose from "mongoose";

const farmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    addressWallet: { type: String, required: true },
});

const Farm = mongoose.models.Farm || mongoose.model('Farm', farmSchema);

export default Farm;