const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    profilePicture:{
        type:String,
        default:"",
    },

     profilePictureId: {
        type: String,
        default: "",
    },

});

const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;