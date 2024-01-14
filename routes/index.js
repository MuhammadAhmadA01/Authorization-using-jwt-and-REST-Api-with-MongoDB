const express=require('express')
const {ensureAuthenticated}=require('../config/auth')
const Router=express.Router();
const PORT=5000||process.env.PORT
Router.get('/',(req,res)=>res.render('welcome'))
Router.get('/dashboard',ensureAuthenticated,(req,res)=>{res.render('dashboard',{name:req.user.name})})
module.exports=Router;