const express=require('express');
const app=express();

const router=express.Router();
const bodyparser=require("body-parser")
const User=require('../schemas/UserSchema');



app.set("view engine","pug");
app.set("views","views")

app.use(bodyparser.urlencoded({extended:false}))

router.get("/",(req, res,next) => {
 
    res.status(200).render('register'); 
   
      
});

router.post("/",async(req, res,next) => {
     
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    
    var username=req.body.username;
    var email=req.body.email;
    
    
    var password=req.body.password;
    
    var payload=req.body;
    if(firstname && lastname && username && email && password){
       var user=await User.findOne({
            $or:[
                {username: username},
                {email: email}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage="Something went wrong"
            res.status(200).render("register",payload)
        });
    

          if(user==null){
              var data=req.body;
              User.create(data)
              .then((user)=>{
                    req.session.user=user;
                    console.log(req.session.user)
                     return res.redirect("/")
              })
            

          }
      
          else{
          
                    if(email==user.email){
                        console.log("error in email or username")
                        payload.errorMessage="Email already in use"
                    }
                    else{
                        console.log("error in email or username")
                        payload.errorMessage="Username went Already in use"
                    }
                    res.status(200).render("register",payload)
                }
            
            }

            else{
                console.log("error")
                payload.errorMessage="Make sure each field has value"
                res.status(200).render("register",payload)
            }


    
   
      
});


module.exports=router;