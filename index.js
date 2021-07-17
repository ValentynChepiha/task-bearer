require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routers/index');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/', router);
app.use(errorMiddleware);

const start = async () => {
   try {
      await mongoose.connect(process.env.DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      });
      app.get('/', (req, res) => res.send('REST API Server'));
      app.listen(PORT, () => {
         console.log(`[server]: Server is running at https://localhost:${PORT}`);
      });

   } catch (e) {
      console.log(`[server]: Error: ${e.message}`);
      process.exit(1);
   }
  };

start();