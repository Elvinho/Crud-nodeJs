const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const { userInfo } = require('os');
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended:false})
const sql = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:'',
  port:3306,
})

sql.query('use nodeja');
app.use('/img',express.static('img'))
app.use('/css',express.static('css'))
app.use('/js',express.static('js'))

//Template engine

app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars')
//app.use('/css',express.static('css')) pode se para js e img


//Routes and Templates
app.get("/",function(req,res){
  /*  res.send("Pagina nicial");*/
 // res.sendFile(__dirname+"/index.html")
 res.render('index')
});

//Inserir
app.get("/inserir",function(req,res){res.render("inserir");})
app.get("/select/:id?",function(req,res){
  if(!req.params.id){
    sql.query("select * from user order by id asc", function(err, results,fields){
      res.render('select',{data:results});
        });
   
    }else{
      sql.query("select * from user where id=? order by id asc",[req.params.id],function(err, results,fields){
        res.render('select',{data:results});
      })
    }
});
app.post("/controllerForm",urlencodeParser,function(req,res){
  sql.query("insert into user values (?,?,?)", [req.body.id,req.body.name,req.body.age])
  res.render("controllerForm", {name:req.body.name})
})
// Deletar
app.get('/deletar/:id',function(req,res){
  sql.query("delete from user where id=?",[req.params.id])
  res.render('deletar');
});
//Editar
app.get('/editar/:id',function(req,res){
  sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
  res.render('editar',{id:req.params.id,name:results[0].name,age:results[0].age})
  })
 
});
app.post("/controllerUpdate",urlencodeParser,function(req,res){
  sql.query("update user set name=?, age=? where id=?",[req.body.name,req.body.age,req.body.id])
  res.render("controllerUpdate")
});

// Start Server
app.listen(3000,()=>{
    console.log('Server Online!');
});