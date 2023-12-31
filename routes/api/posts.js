const express=require('express');
const app=express();

const router=express.Router();
const bodyparser=require("body-parser")
const User=require('../../schemas/UserSchema');
const Post=require('../../schemas/PostSchema');



app.set("view engine","pug");
app.set("views","views")

app.use(bodyparser.urlencoded({extended:false}))

router.get("/",async(req, res,next) => {
      // Post.find()
      // .populate("postedBy")
      // .populate("retweetData")
      // .sort({"createdAt":-1})
      // .then( async results =>{
      //   results=await User.populate(results,{path:"retweetData.postedBy"})
      //   res.status(200).send(results)
      
      // })
      // .catch(error =>{
      //   console.log(error);
      //   res.sendStatus(400);
      // })
      var results= await getPosts({});
     
     res.status(200).send(results);
       
});

router.get("/:id",async (req, res,next) => {
 
  var PostId=req.params.id;

 
  var postData= await getPosts({_id:PostId});
  postData=postData[0];
  var results={
    postData:postData
  }

if(postData.replyTo!==undefined){
  results.replyTo=postData.replyTo;
}

results.replies=await getPosts({replyTo:PostId})
     


res.status(200).send(results)
});



router.post("/", async (req, res,next) => {
 
    // if(req.body.replyTo){
    //   console.log(req.body.replyTo);
    //   return res.sendStatus(400)
    // }

    if(!req.body.content){
        console.log("Content param not sent with request")
        return res.sendStatus(400);
      }


      var postData={
        content:req.body.content,
        postedBy:req.session.user,
     }

     if(req.body.replyTo){
      postData.replyTo=req.body.replyTo;
     }
       
     Post.create(postData)
     .then(async newPost=>{
        newPost=await User.populate(newPost,{path:"postedBy"});

           res.status(201).send(newPost);
     })
     .catch((error)=>{
       console.log(error)
       res.sendStatus(400)
     })
   
      
});



router.put("/:id/like", async (req, res,next) => {
    var postId=req.params.id;
    var userId=req.session.user._id;

    var isLiked=req.session.user.likes && req.session.user.likes.includes(postId);
    var option=isLiked ? "$pull":"$addToSet";
    //insert user likes
    

  req.session.user= await User.findByIdAndUpdate(userId,{[option]:{likes:postId}},{new: true})
  .catch(error=>{
    res.sendStatus(400);
  })

    //insert post likes

    var post= await Post.findByIdAndUpdate(postId,{[option]:{likes:userId}},{new: true})
    .catch(error=>{
      res.sendStatus(400);
    })
  
res.status(200).send(post)

    
});




router.post("/:id/retweet", async (req, res,next) => {


  var postId=req.params.id;
  var userId=req.session.user._id;

//try and delete 

var deletePost=await Post.findOneAndDelete({postedBy:userId,retweetData:postId})
.catch(error=>{
  console.log(error)
  res.sendStatus(400);
})



  var option=deletePost !=null ? "$pull":"$addToSet";

 var repost=deletePost;
 if(repost==null){
  repost=await Post.create({postedBy:userId,retweetData:postId})
  .catch(error=>{
    console.log(error)
    res.sendStatus(400);
  })
  
 }

 
  //insert userreposts

 req.session.user= await User.findByIdAndUpdate(userId,{[option]:{retweets:repost._id}},{new: true})
.catch(error=>{
  res.sendStatus(400);
})


  

  //insert user likes

  var post= await Post.findByIdAndUpdate(postId,{[option]:{retweetUsers:userId}},{new: true})
  .catch(error=>{
    res.sendStatus(400);
  })

res.status(200).send(post)

  
});

router.delete("/:id",(req,res,next)=>{

Post.findByIdAndDelete(req.params.id)
.then(() =>res
.sendStatus(202))
.catch(error=>{
  console.log(error)
  res.sendStatus(400);
})


})





async function getPosts(filter){
      
  var results=await Post.find(filter)
  .populate("postedBy")
  .populate("retweetData")
  .populate("replyTo")
  .sort({"createdAt":-1})
  .catch(error =>{
    console.log(error);
    res.sendStatus(400);
  })
 results=await User.populate(results,{path:"replyTo.postedBy"});
  return results=await User.populate(results,{path:"retweetData.postedBy"});
  

}



// router.post("/:id/retweet", async (req, res,next) => {


//   var postId=req.params.id;
//   var userId=req.session.user._id;

  
// });

module.exports=router;