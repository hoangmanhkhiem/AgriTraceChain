import mongoose from "mongoose";

// cong ty logictuc
const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    addressWallet: { type: String, required: true },
    address: { type: String, required: true },
});

const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);

export default Store;