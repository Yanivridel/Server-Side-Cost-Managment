import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    birthday: { type: Date },
    marital_status: { 
        type: String, 
        enum: ["single", "married", "divorced", "widowed", "separated", "engaged", "complicated", "prefer not to say"],
        default: "prefer not to say", 
        required: true
    }
}, { timestamps: true } );

export default mongoose.model("User", userSchema);