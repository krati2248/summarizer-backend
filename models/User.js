const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true, 
        trim: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true 
    },
    password:
    {
        type: String,
        required: true 
    },
    role:
    {
        type: String,
        required: true,
        default:"student"
    },
    image:
    {
       public_id: {
            type:String,
            require:true
        },
        url: {
            type:String,
            require:true
        },
    },
    provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  googleId: {
    type: String  
  }
},{timestamps:true});
const User = mongoose.model("User", userSchema);
module.exports = User;