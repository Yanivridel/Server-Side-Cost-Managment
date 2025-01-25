
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose, { mongo } from "mongoose"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI).then(() => console.log("Successfully Connected to DB"))

// Import Routes
import userRoutes from './routes/userRoutes.js'
import costRoutes from './routes/costRoutes.js'

app.use("/api/users", userRoutes);
app.use("/api", costRoutes);

app.get("/api/about", (req, res) => {
    res.json({
        developers: [
            {
                first_name: "Tomas",
                last_name: "Shahwan",
            },
            {
                first_name: "Yaniv",
                last_name: "Ridel",
            }
        ]
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
