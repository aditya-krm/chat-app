import mongoose from "mongoose";
const connectToMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
};

export default connectToMongoDB;