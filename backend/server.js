import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import 'dotenv/config'



// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB().then(() => {
  console.log("Database connected successfully")
}).catch((error) => {
  console.error("Error connecting to database:", error)
  process.exit(1)
});

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use(cors());

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.use((error, req, res, next) => {
    console.error("Error handling request:", error)
    res.status(500).json({ message: "Internal Server Error" })
  })

app.listen(port,()=>{
    console.log(`Server Started on htttp://localhost:${port}`)
})
