import { Types } from "mongoose";
import costModel from "../models/costModel.js";
import userModel from "../models/userModel.js";

export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, birthday, marital_status } = req.body;

        if(!first_name || !last_name)
            res.status(400).send({ status:"Error", message: "Missing required parameters"});

        const newUser = new userModel({
            first_name,
            last_name,
            birthday: new Date(birthday),
            marital_status
        })

        await newUser.save();

        res.status(201).json({
            status: "Success",
            message: "User created successfully",
            data: newUser
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

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id)
            res.status(400).send({ status:"Error", message: "Missing required parameters"});

        const foundUser = await userModel.findById(id);

        if(!foundUser)
            res.status(404).send({ status:"Error", message: "User not found"})

        const total = await costModel.aggregate([
            { $match: { userid: new Types.ObjectId(id) } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        const totalCost = total.length > 0 ? total[0].total : 0;

        res.status(200).json({
            status: "Success",
            message: "User found successfully",
            data: {
                id: foundUser._id,
                first_name: foundUser.first_name,
                last_name: foundUser.last_name,
                total: totalCost
            },
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

