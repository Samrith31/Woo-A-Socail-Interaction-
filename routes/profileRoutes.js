const express=require('express');
const app=express();

const router=express.Router();
const bodyparser=require("body-parser")
const User=require('../schemas/UserSchema');





app.use(bodyparser.urlencoded({extended:false}))

router.get("/",(req, res,next) => {
 

    var payload={
        pageTitle: req.session.user.username,
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user),
        profileUser:req.session.user
     }
    res.status(200).render('profilePage',payload); 
   
      
});

async function getPayload(username,userLoggedIn){
    user=await User.findOne({username:username});

   if(user==null){

    var user=await User.findById({username:username});
   if(user==null){
    return{
        pageTitle:"User not Found",
        userLoggedIn:userLoggedIn,
        userLoggedInJs:JSON.stringify(userLoggedIn)


    }
   }


   
   }

   return{
    pageTitle:user.username,
        userLoggedIn:userLoggedIn,
        userLoggedInJs:JSON.stringify(userLoggedIn),
        profileUser:user
        
   }

}





module.exports=router;