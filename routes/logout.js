const express=require('express');
const app=express();

const router=express.Router();
const bodyparser=require("body-parser")
const User=require('../schemas/UserSchema');



app.set("view engine","pug");
app.set("views","views")

app.use(bodyparser.urlencoded({extended:false}))

router.get("/",(req, res,next) => {
    req.session.destroy(()=>{
        res.redirect("/login");
        
    })
    
   
      
});

module.exports=router;