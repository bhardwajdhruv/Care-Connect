import { catchAsyncErrors } from '../middlewares/catchAscynErrors.js'
import { Message } from "../models/messageSchema.js"
import ErrorHandler from '../middlewares/errorMiddleware.js'

export const sendMessage = catchAsyncErrors(async(req,res,next) => {
    const {firstName, lastName, email, phone, message} = req.body;
    if(!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("Please Fill full form", 400))
    }
    await Message.create({firstName, lastName, email, phone, message });
    res.status(200).json ({
        success:true,
        message: 'Message sent successfully',
    });
});

export const getAllMessages = catchAsyncErrors(async(res, req, next) => {
    const messages = await Message.find();
    req.status(200).json({
        success: true,
        messages,
    })
})