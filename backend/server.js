import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js';
import router from './routes/user.route.js'
import cors from "cors"

const app = express();
const PORT =process.env.PORT || 3000

//MIDDLEWARE
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/api/v1/user',router)

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is listening at port: ${PORT}`);
})