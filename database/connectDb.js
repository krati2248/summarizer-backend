const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//url = 'mongodb://127.0.0.1:27017/summarizerDB';
url = process.env.MONGO_URI;
const connectDb = async () =>
{
    try
    {
        await mongoose.connect(url);
        console.log('mongodb connected');
    }
    catch (error)
    {
        console.log('not connecting');
        console.log(error);
    }
}
module.exports = connectDb;