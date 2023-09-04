const express = require('express');
const connection = require('../connection');
const { request } = require('..');
const { JsonWebTokenError } = require('jsonwebtoken');
const router = express.Router();
const jwt=require("jsonwebtoken")
const crypto = require('crypto'); // Import the crypto module



router.post('/create', (req, res, next) => {
    let product = req.body;
    let query = "INSERT INTO product (name, description, price) VALUES (?, ?, ?)";
    connection.query(query, [product.name, product.description, product.price], (err, results) => {
        if (!err) {
            return res.status(200).json({
                message: 'Product added successfully'
            });
        } else {
            console.error(err); 
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    });
});

router.get('/read',varifytoken,(req,res,next)=>{
   var query="select * from product";
   connection.query(query,(err,results)=>{
    if(!err){
       
        return res.status(200).json(results)
        
    }
    else{
        return res.status(500).json(err)
    }
   })
})

router.patch('/update/:id', (req, res, next) => {
    const id = req.params.id;
    const product = req.body;
    const query = "UPDATE product SET name=?, description=?, price=? WHERE id=?";
    
    connection.query(query, [product.name, product.description, product.price, id], (err, results) => {
        if (!err) {
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Product ID not found'
                });
            }
            return res.status(200).json({
                message: 'Product updated successfully'
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.delete('/delete/:id',(req,res,next)=>{
    const id =req.params.id
    const query="delete from product where id=?"

    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows===0){
                return res.status(404).json({
                    message:'id not fount'
                })
            }
            return res.status(200).json({
                message:'delete sucessfully'
            })
        }
        else{
            return res.status(500).json(err)
        }
    })
})

// middleware
function varifytoken(req,res,next){
   let authHeader= req.headers.authorization;
   if(authHeader==undefined){

    return res.status(401).json({
        error: "no token"
        })

   }
   let token = authHeader.split(" ")[1]
   jwt.verify(token,"your-secret-key",(err,decoded)=>{
    if(err){
        return res.status(500).json({
            message:'failed'
        })
    }else{
        next()

    }
   })
}


router.post('/login', (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(500).json({
            message: "error authentication"
        });
        return;
    }
    const username = req.body.username;
    const password = req.body.password;

    // Hash the password using SHA-1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const query = "SELECT displayname FROM usertable WHERE username=? AND password=?";
    connection.query(query, [username, hashedPassword], (err, result) => {
        if (!err && result.length > 0) {
            const user = result[0];
            const token = jwt.sign(
                { id: user.id, displayname: user.displayname },
                'your-secret-key', // Replace with your secret key
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                message: "login successfully",
                token: token

            });
        } else {
            return res.status(500).json({
                message: "failed login"
            });
        }
    });
});


module.exports = router;





