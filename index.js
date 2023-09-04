const express=require('express');
const app=express();
const connection=require("./connection")
const productroute=require('./routes/product')

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/product',productroute);

module.exports=app;