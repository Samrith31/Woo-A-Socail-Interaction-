const mongoose=require('mongoose')

const Schema=mongoose.Schema;


const usersSchema = new Schema({
    firstname: {type:String},
    lastname:  {type:String},
    username:  {type:String},
    email:  {type:String},
    password:  {type:String},
    profilepic:{type:String, default:"/images/defalutprofilepic.png"},
    likes:[{type:Schema.Types.ObjectId, ref:"posts"}],
    retweets:[{type:Schema.Types.ObjectId, ref:"posts"}]

},{timestamp: true});

  
  const User = mongoose.model('users', usersSchema);
  module.exports=User;
