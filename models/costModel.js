import mongoose, { Schema } from "mongoose";

const costSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    userid: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sum: { 
        type: Number,
        required: true
    },
    date: { type: Date, required: true }
}, { timestamps: true } );

export default mongoose.model("Cost", costSchema);