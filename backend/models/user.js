import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [50, 'Your name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,  // email must be unique
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false, // hide password from user
    },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
    role: {
        type: String,
        default: 'user', // default role is user when user register
    },
    resetPasswordToken: String, // token for reset password
    resetPasswordExpire: Date, // expire time for reset password
},
    { timestamps: true } // show the time when user created
);

// encrypt password before save user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema); 