const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const{ USER } = require('./config/config');
const User = db.user;

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}))

// app.get('', (req,res)=>{
//     res.send("welcome user!!!!!")
// })

app.get('/getAllUsers', (req,res)=>{
    User.findAll().then(data=>{
        res.send(data)
    }).catch(err=>{
        res.status(500).send({
            message: err.message||"Some error occurred while retrieving users"
        });
    });
});

app.post('/createUser',(req,res)=>{
    if(!req.body.firstName||!req.body.lastName||!req.body.password||!req.body.email){
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    const user ={
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
    };

    User.create(user).then(data=>{
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message: err.message||"Some error occurred while creating the tutorial"
        });
    });
});

app.get('/getSingleUser/:id', (req,res)=>{
    const id = req.params.id;
    User.findByPk(id).then(data=>{
        if(data){
            res.status(200).send(data)
        }else{
            res.status(404).send("User not found")
        }
       
    }).catch(err=>{
        res.status(500).send({
            message: "Error retrieving User with id = "+ id
        });
    });
});

app.delete('/deleteSingleUser/:id', (req,res)=>{
    const id = req.params.id;
    User.destroy({
        where: {id: id}
    }).then(num =>{
    if(num==1){
        res.send({
            message: "User was deleted successfully!"
        });
    }else{
        res.send({
            message: `Cannot delete user with id = ${id}.Maybe user was not found`
        })
    }
}).catch(err=>{
    res.status(500).send({
        message: "Couldnot delete user with id= "+ id
    });
});
});
app.put('/updateSingleUser/:id', (req, res)=>{
    const id = req.params.id;
    User.update(req.body, {
        where: {id: id}
    }).then(num=>{
        if(num==1){
            res.send({
                message: "User was updated successfully"
            });
        }else{
            res.send({
                message: `Cannot update user with id = ${id}. Maybe user was not found or req.body is empty`
            });
        }
    }).catch(err=>{
        res.status(500).send({
            message: "Error updating user with id = "+ id
        });
    });
});

db.sequelize.sync().then(()=>{}).catch((err)=>{
    console.log(err)
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
});

