const mongoose=require('mongoose');

async function connectedDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connect to DB');
    }catch(err){
        console.log('cannot connect',err);
    }
}

module.exports=connectedDB;