import mongoose from "mongoose";

// cong ty logictuc
const logisticsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    addressWallet: { type: String, required: true },
    vehicles: [{ type: String }]
});

const Logistics = mongoose.models.Logistics || mongoose.model('Logistics', logisticsSchema);

export default Logistics;