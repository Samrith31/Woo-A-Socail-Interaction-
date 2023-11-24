
const mongoose=require("mongoose")

const Schema=mongoose.Schema;



const PostSchema= new Schema({
    content:{type:String,trim:true},
    postedBy:{type:Schema.Types.ObjectId, ref:"users"},
    pinned:Boolean,
    likes:[{type:Schema.Types.ObjectId, ref:"users"}],
    retweetUsers:[{type:Schema.Types.ObjectId, ref:"users"}],
    retweetData:{type:Schema.Types.ObjectId, ref:"posts"},
    replyTo:{type:Schema.Types.ObjectId, ref:"posts"}

},{timestamps: true});

  
  const Post = mongoose.model('posts',PostSchema );
  module.exports=Post;
