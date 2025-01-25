import { Types } from "mongoose";
import costModel from "../models/costModel.js";
import userModel from "../models/userModel.js";
import reportModel from "../models/reportModel.js";

export const createCost = async (req, res) => {
    try {
        let { description, category, userid, sum, date } = req.body;

        if(!description || !category || !userid || !sum)
            res.status(400).send({ status:"Error", message: "Missing required parameters"});

        const foundUser = await  userModel.findById(userid);

        if(!foundUser)
            res.status(404).send({ status:"Error", message: "User not found"})

        date = date ? new Date(date) : new Date();

        const newCost = new costModel({
            description,
            category,
            userid: new Types.ObjectId(userid),
            date,
            sum
        })

        await newCost.save();

        res.status(201).json({
            status: "Success",
            message: "Cost added successfully",
            data: newCost
        })
    } catch(err) {
        console.log(err); // dev
        res.status(500).json({
            status: "Error",
            message: "An unexpected error occurred",
            error: err.message
        })
    }
}

export const getReport = async (req, res) => {
    try {
        let { id, year, month } = req.query;

        if (!id || !year || !month) {
            return res.status(400).json({ error: "Missing required parameters: id, year, and month." });
        }

        month = getMonthIndex(month);

        const cacheKey = `${id}-${year}-${month}`;

        const foundReport = await reportModel.find({cacheKey});
        
        if(foundReport.length) {
            return res.status(200).json({
                status: "Success",
                message: "Report found successfully from cache",
                data: foundReport
            })
        }

        const report = await costModel.aggregate([
            {
                // Match documents for the specific user
                $match: {
                    userid: new Types.ObjectId(id),
                },
            },
            {
                // Project the year and month from the date
                $project: {
                    category: 1,
                    description: 1,
                    sum: 1,
                    date: 1,
                    year: { $year: "$date" },   // Extract the year from the date
                    month: { $month: "$date" },  // Extract the month from the date
                },
            },
            {
                // Match by year and month from the query parameters
                $match: {
                    year: parseInt(year),
                    month: parseInt(month),
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$sum" },
                    costs: { $push: { description: "$description", sum: "$sum", date: "$date" } },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total: 1,
                    costs: 1,
                },
            },
        ]);
        
        const newReport = new reportModel({
            cacheKey,
            report
        })

        await newReport.save();

        res.status(201).json({
            status: "Success",
            message: "Report created successfully",
            data: report
        })
    } catch(err) {
        console.log(err); // dev
        res.status(500).json({
            status: "Error",
            message: "An unexpected error occurred",
            error: err.message
        })
    }
}

// Help functions
function getMonthIndex(monthName) {
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    monthName = monthName.toLowerCase();

    // Find the index in the months array
    return months.indexOf(monthName) + 1;
}