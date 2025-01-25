import mongoose, { Schema } from "mongoose";
import cron from 'node-cron';

const reportSchema = new mongoose.Schema({
    cacheKey: {
        type: String,
        required: true,
    },
    report: [{
        category: { type: String, required: true },
        total: { type: Number, required: true },
        costs: [{
            description: { type: String, required: true },
            sum: { type: Number, required: true },
            date: { type: Date, required: true }
        }]
    }],
}, { timestamps: true } );

cron.schedule('0 0 * * *', async () => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 1); // Reports older than 7 days

        await reportModel.deleteMany({ createdAt: { $lt: cutoffDate } });

        console.log("Old reports deleted successfully");
    } catch (error) {
        console.error("Error cleaning up old reports:", error);
    }
});

export default mongoose.model("Report", reportSchema);