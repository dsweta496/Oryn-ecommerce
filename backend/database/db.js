import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/Oryn-ecommerce`)
        console.log("Datbase connected successfully.");
        
    }catch(error){
        console.log("MongoDB connection failed, ", error);
        
    }
}

export default connectDB;