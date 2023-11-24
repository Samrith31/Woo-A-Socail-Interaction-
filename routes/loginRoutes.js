const express=require('express');
const app=express();

const router=express.Router();
const bodyparser=require("body-parser")
const User=require('../schemas/UserSchema');



app.set("view engine","pug");
app.set("views","views")

app.use(bodyparser.urlencoded({extended:false}))

router.get("/",(req, res) => {
 
    res.status(200).render('login'); 
   
      
});

router.post('/',async(req,res,next)=>{
    
    var payload=req.body;
    if(req.body.logusername && req.body.logpassword){
        var user=await User.findOne({
            $or:[
                {username: req.body.logusername},
                {email: req.body.logusername}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage="Something went wrong"
            res.status(200).render("login",payload)
        }); 

        if(user!=null){
            if(req.body.logpassword==user.password){

                var result=1;
            }
            if(result==1){
                 req.session.user=user;
                 return res.redirect("/")
                 
            }
           
        }
        payload.errorMessage="Login credentials incorrect";
        res.status(200).render("login",payload)

    }
    payload.errorMessage="make sure each field has value";
    res.status(200).render('login')
    
})


module.exports=router;