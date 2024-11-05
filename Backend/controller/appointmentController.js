import { catchAsyncErrors } from "../middlewares/catchAscynErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;

    // Check for required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    // Check for doctor availability
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found", 404));
    }
    if (isConflict.length > 1) {
        return next(new ErrorHandler("Doctors conflict. Please contact via Email or Phone", 404));
    }

    const doctorID = isConflict[0]._id;

    // Check if req.user exists and retrieve patient ID
    const patientID = req.user ? req.user._id : null;
    if (!patientID) {
        return next(new ErrorHandler("Patient not authenticated", 401));
    }

    // Create the appointment
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: { firstName: doctor_firstName, lastName: doctor_lastName },
        hasVisited,
        address,
        doctorID,
        patientID,
    });

    res.status(200).json({
        success: true,
        message: "Appointment sent successfully",
        appointment,
    });
});

export const getAllAppointments = catchAsyncErrors(async(req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(async(req, res, next) => {
    const{id} = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFineAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
        appointment,
    });
});

export const deleteAppointment = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
    })
})