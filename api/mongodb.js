import mongoose from "mongoose";

const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('connected')
    }
    catch(error){
        console.log(error)
    }
}

export default connectMongoDB;


//MONGO_URL = mongodb+srv://catalinahardoy:admin@cluster0.pohmvyb.mongodb.net/fungiapp?retryWrites=true&w=majority