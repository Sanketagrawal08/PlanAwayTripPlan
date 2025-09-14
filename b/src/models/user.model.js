import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    // safetyPin: { type: String, required: true , default:"123456" },
    emergencyContacts:  [
        {
            name: { type: String, required: true },
            number: { type: String, required: true },
            email:{type: String}
        }
    ]
});

const userModel = mongoose.model("User", userSchema);
export default userModel;