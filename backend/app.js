import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
   console.log(`ERROR: ${err}`);
   console.log(`Shutting down the server due to uncaught exception`);
   process.exit(1); 
});

dotenv.config({ path: "backend/config/config.env" });

// connect database
connectDatabase();

app.use(express.json());


// import all routes
import productRoutes from "./routes/products.js";

// middleware to handle errors
app.use(errorMiddleware);

app.use("/api/v1", productRoutes);

// Using middleware to handle errors
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
    });


// handle Unhandled Promise rejections
process.on("unhandledRejection", err => {
   console.log(`Error: ${err}`);
   console.log("Shutting down the server due to Unhandled Promise rejection");
   server.close(() => {
       process.exit(1);
   }); 
});
