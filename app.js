require('dotenv').config()
const express=require('express');
const app=express();
const middleware=require('./middleware');
const path=require('path')
const fs=require('fs');
const bodyparser=require("body-parser")
const mongoose=require("./database");
const session=require('express-session');
const User=require('./schemas/UserSchema');
var multer  = require('multer')

const port=3003;


app.listen(port,()=>{
    console.log(`The application started succesfully on port ${port}`);
})

app.use(express.static('public'));
app.use('/images', express.static('images'));




app.set("view engine","pug");
app.set("views","views")

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,"public")))

app.use(session({
    secret:"i love m",
    resave:true,
    saveUninitialized:false,

}))


//Routes

const loginRoute=require('./routes/loginRoutes');
const registerRoute=require('./routes/registerRoutes');
const logoutRoute=require('./routes/logout');
const postRoutes=require('./routes/postRoutes');

//api routes

const postApiRoute=require('./routes/api/posts');

app.use("/login",loginRoute);
app.use("/register",registerRoute);
app.use('/logout',logoutRoute);
app.use('/api/posts',postApiRoute);
app.use('/posts',postRoutes);


app.get("/upload",async(req, res,next) => {

  var results= await getPosts({});
   
  res.status(200).send(results);
 
});



app.get("/",middleware.requireLogin,(req, res,next) => {
 
  var payload={
     pageTitle: "Home",
     userLoggedIn:req.session.user,
     userLoggedInJs:JSON.stringify(req.session.user),
  }

  res.status(200).render('home',payload); 
 
      
});



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        console.log(file)

        cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname));
  }
})
 
var upload = multer({ storage: storage }).single('image')



   
        


app.post("/upload",upload,async(req, res,next) => {
    var userId=req.session.user._id;
    var imagepath="/images/"+req.file.filename;
    console.log(imagepath)
   console.log(userId)
   req.session.user= await User.findByIdAndUpdate(userId,{profilepic:imagepath})
   .catch(error=>{
     res.sendStatus(400);
   })
   
   
   

    res.redirect('login')
  // res.redirect(req.get('referer'))
   
        
});


async function getUser(filter){
      
    var results=await User.find(filter)
    .populate("profilepic")
    .catch(error =>{
      console.log(error);
      res.sendStatus(400);
    })
  
    return results;
    
  
  }
  

