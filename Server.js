const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv");
const app = express();

const { connectDB } = require('./Src/Config/db');
const routes = require('./Src/Routes');
const { notFound, errorHandler } = require("./Src/Middlewares/errorHandler");

dotenv.config();
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: '*'
}
app.use(cors(corsOptions));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'Src', 'Images')));

// connect MongoDB Using Mongoose
connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Server Running");
});
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const Server = app.listen(process.env.PORT, () => {
  console.log("Server Running on  Port " + process.env.PORT);
});
