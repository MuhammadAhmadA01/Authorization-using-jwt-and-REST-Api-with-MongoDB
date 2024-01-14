const express = require("express");
const path=require('path')
const flash=require('connect-flash')
const session=require('express-session')
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const db = require("./config/keys").MongoURI;
const passport=require('passport')

require('./config/passport')(passport)

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

const PORT = 5000 || process.env.PORT;
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,

}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success=req.flash('success_msg')
    res.locals.errorMsg=req.flash('error')
    
    res.locals.error=req.flash('error_msg')
    next()
})
app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

app.listen(PORT, () => console.log(`listen on port ${PORT}`));
