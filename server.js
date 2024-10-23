//console.log("I am in express projects");
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');
connectDB();
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())

app.use('/api/contacts', require("./routes/contactsRoute"));
app.use('/api/users', require("./routes/userRoute"));

app.use(errorHandler)
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});