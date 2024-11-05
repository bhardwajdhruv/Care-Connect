import { catchAsyncErrors } from "../middlewares/catchAscynErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic, role, } = req.body;
    if( !firstName || !lastName || !email|| !phone || !password || !gender || !dob || !nic || !role ){
        return next(new ErrorHandler('Please fill in all fields', 400));
    }
    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler('Email already in use', 400));
    }
    user = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role, });
    generateToken(user, "User created successfully", 200, res)
});

export const login = catchAsyncErrors(async(req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if( !email || !password || !confirmPassword || !role ){
        return next(new ErrorHandler('Please fill in all fields', 400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler('Passwords do not match', 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401));
    }
    if(role !== user.role){
        return next(new ErrorHandler('You are not authorized to access this page', 401));
    }
    generateToken(user, "Logged in successfully", 200, res)
});

export const addNewAdmin = catchAsyncErrors(async(req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic} = req.body;
    if( !firstName || !lastName || !email|| !phone || !password || !gender || !dob || !nic){
        return next(new ErrorHandler("Please fill the form", 400))
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already in use`))
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin",});
    res.status(200).json({
        success: true,
        message: "Admin created successfully",
    });
});

export const getAllDoctors = catchAsyncErrors(async(req, res, next) => {
    const doctors = await User.find({role: "Doctor"});
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user, 
    });
});

export const logoutAdmin = catchAsyncErrors(async(req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Logged out successfully",
    });
});
export const logoutPatient = catchAsyncErrors(async(req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const addNewDoctor = catchAsyncErrors(async(req, res, next) => {
    // Check if files are uploaded
    if (!req.files || !req.files.docAvatar) {
        return next(new ErrorHandler("Doctor Avatar is required", 400));
    }

    const { docAvatar } = req.files;

    // Check file mimetype
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("Invalid Avatar Format", 400));
    }

    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;

    // Check required fields
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already in use`, 400));
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(docAvatar.tempFilePath, {
        folder: "doctors_avatars",
    });

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Error uploading image to Cloudinary", 500));
    }

    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doctor",
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
    });
});
