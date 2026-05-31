const connectToMongo  = require('./db');
const express = require('express')
const cors = require('cors');
require('dotenv').config();

connectToMongo();

const app = express()
const port = process.env.PORT || 5000;

// TEST purpose route
app.get('/', (req, res) => {
  res.send('Parchi backend running 🚀');
});

app.use(cors({
  origin: "https://parchi-pi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());
app.use(cors());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parchi', require('./routes/parchi'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})