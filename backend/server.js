import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import orderRoute from "./routes/order.routes.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000



const allowedOrigins = [
    "http://localhost:5173",
    "https://oryn-frontend-c0ib.onrender.com"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
//MIDDLEWARE
app.use(express.json());

app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use("/api/v1/order", orderRoute);


app.listen(PORT, () => {
    connectDB();
})