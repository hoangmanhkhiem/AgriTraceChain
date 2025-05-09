import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    certifications: [{ type: String }],
    createdAt: { type: Date, required: true },
    txHash: { type: String, required: true },
    blockHeight: { type: String, required: true },
    timestamp: { type: Date, required: true },
    farmer: {
        name: { type: String, required: true },
        walletAddress: { type: String, required: true }
    },
    transportHistory: [{
        date: { type: Date, required: true },
        location: { type: String, required: true },
        status: { type: String, required: true },
        handler: { type: String, required: true },
        txHash: { type: String, required: true }
    }]
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;