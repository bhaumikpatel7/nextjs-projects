import mongoose, { mongo } from "mongoose";

export async function connect(){
    try {
        
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;

        connection.on('connected',()=>{
            console.log("MongoDB Connected");
        })

        connection.on('error',(error)=>{
            console.log("MongoDB not Connected : "+error);
            process.exit(1)
        })

    } catch (error) {
        console.log("Something went wrong in connecting to DB");
        console.log(error);
        
        
    }
}