const mongoose=require('mongoose')

class Database{
     constructor(){
        this.connect();
     }

    connect(){
    //mongoose.connect('mongodb://127.0.0.1/Users_Woo1', {useNewUrlParser: true})
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database Connctoin sucessfull");
    })
    .catch((err)=>{
        console.log("data connection error "+err)
    });
     const port=7000;
    }
}

module.exports=new Database();