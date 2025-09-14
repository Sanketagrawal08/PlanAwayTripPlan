import mongoose from "mongoose";
function connecttodb () {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log("error in db connection", err);
    });
}

export default connecttodb;