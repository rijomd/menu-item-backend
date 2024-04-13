const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})
app.use(limiter)

// connect MongoDB Using Mongoose
connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Server Running");
});
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server Running on  Port " + process.env.PORT);
});
