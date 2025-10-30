const express = require('express');
const app = express();
const port = 3000;
const connectDb = require('./database/connectDb');
const web = require('./routes/web');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

 

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true
}));
app.use(cookieParser());
 

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // to allow cookies
}));

connectDb();
 
app.use('/',web);
app.listen(port,() => {
    console.log("localhost server");
})