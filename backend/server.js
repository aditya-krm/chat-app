import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
const app = express();
const port = process.env.PORT || 3000;


dotenv.config();

app.use(express.json());//to parse the incoming request with JSON payloads(from request.body)
app.use("/api/auth", authRoutes);


// app.get('/', (req, res) => {
//     res.send('Hello World!');
//     console.log('Hello World!');
// });


app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server listening at http://localhost:${port}`);
    }
);