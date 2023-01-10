//jshint esversion:6

const mysql = require("mysql");
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const cors = require("cors");
const e = require("express");

const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

const io = new WebSocket.Server({ noServer: true });
global.io = new WebSocket.Server({ noServer: true });

app.use(express.static("public"));
app.use(cors());

var db = mysql.createConnection({
    host: "mysql-104344-0.cloudclusters.net",
    user: "admin",
    password: "y0ev6CVZ",
    database: "sculptica",
    port: 10218
});

// var db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "@Akash2002",
//     database: "sculptica"
// });

const underweight = "Eating at least 5 portions of a variety of fruit and vegetables every day. Basing meals on potatoes, bread, rice, pasta or other starchy carbohydrates. Choose wholegrain where possible. Having some dairy or dairy alternatives (such as soya drinks and yoghurts). Have whole (full-fat) milk until you build your weight back up. Eating some beans, pulses, fish, eggs, meat and other protein. Aim for 2 portions of fish every week ? 1 of which should be oily, such as salmon or mackerel. Choosing unsaturated oils and spreads, such as sunflower or rapeseed, and eating them in small amounts. Drinking plenty of fluids. The government recommends 6 to 8 glasses a day. But try not to have drinks just before meals to avoid feeling too full to eat.";

const normal = "Emphasize fruits, vegetables, whole grains, and fat-free or low-fat milk and milk products. Include a variety of protein foods such as seafood, lean meats and poultry, eggs, legumes (beans and peas), soy products, nuts, and seeds. Consume food which is low in added sugars, sodium, saturated fats, trans fats, and cholesterol. Stay within your daily calorie needs.";

const overweight="Choose minimally processed, whole foods-whole grains, vegetables, fruits, nuts, healthful sources of protein (fish, poultry, beans), and plant oils. Limit sugared beverages, refined grains, potatoes, red and processed meats, and other highly processed foods, such as fast food.";

const obese="Plenty of fruit and vegetables. Plenty of potatoes, bread, rice, pasta and other starchy foods (ideally you should choose wholegrain varieties) Some milk and dairy foods. Some meat, fish, eggs, beans and other non-dairy sources of protein. Just small amounts of food and drinks that are high in fat and sugar.";

var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
var flag4 = 0;
var flag5 = 0;
var flag6 = 0;
  
db.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected!");
        db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'sculptica';`,(err,tables)=>{
            // console.log(tables[2].TABLE_NAME);
            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "LOGIN_CRED") flag1 = 1;
            }
        

            if(!flag1){
                var sql = "CREATE TABLE LOGIN_CRED (name varchar(30),email varchar(50),passwd text);"
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("LOGIN_CRED created");
                    }
                });
            }
           
            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "DIET") flag2 = 1;
            }
     

            if(!flag2){
                db.query("CREATE TABLE DIET (sno int,wtstatus varchar(20),recommendation varchar(5000));",function(err,result){
                    if(err) console.log(err);
                    else{
                        db.query("INSERT INTO DIET (sno,wtstatus,recommendation) VALUES(?,?,?)",[0,"UNDERWEIGHT",underweight],(err,result,field)=>{
                            if(err) console.log(err);
                        });
                        db.query("INSERT INTO DIET (sno,wtstatus,recommendation) VALUES(?,?,?)",[1,"NORMAL",normal],(err,result,field)=>{
                            if(err) console.log(err);
                        });
                        db.query("INSERT INTO DIET (sno,wtstatus,recommendation) VALUES(?,?,?)",[2,"OVERWEIGHT",overweight],(err,result,field)=>{
                            if(err) console.log(err);
                        });
                        db.query("INSERT INTO DIET (sno,wtstatus,recommendation) VALUES(?,?,?)",[3,"OBESE",obese],(err,result,field)=>{
                            if(err) console.log(err);
                        });
                        console.log("DIET table created");
                    }
                });
            }

            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "TRAINERS") flag3 = 1;
            }
         

            if(!flag3){
                var sql = "CREATE TABLE TRAINERS (tid int primary key auto_increment,tname varchar(20),specification varchar(20),email varchar(50));"
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("TRAINERS table created");
                    }
                });
            }


            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "USERS") flag4 = 1;
            }
      

            if(!flag4){
                var sql = "CREATE TABLE USERS (uid int primary key auto_increment,fname varchar(20),lname varchar(20),age int,date varchar(20),email varchar(50),phone varchar(20),address varchar(100));"
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("USERS created");
                    }
                });
            }

            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "GYMITEMS") flag5 = 1;
            }
 

            if(!flag5){
                var sql = "CREATE TABLE GYMITEMS (id int primary key auto_increment,name varchar(250),imgpath text,imaghere longtext,howtouse longtext);";
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("GYMITEMS created");
                    }
                });
            }

            for(var i=0;i<tables.length;i++){
                if(tables[i].TABLE_NAME == "FEEDBACK") flag6 = 1;
            }


            if(!flag6){
                var sql = "CREATE TABLE FEEDBACK (id int primary key auto_increment,name varchar(50),email varchar(60),phone varchar(20),message varchar(2000));"
                db.query(sql,function(err,result){
                    if(err) console.log(err);
                    else{
                        console.log("FEEDBACK table created");
                    }
                });
            }
           

        });   
    }
});

app.get("/", (req, res) => {
    res.render("index");
});

// app.get("/createdb", (req, res) => {
//     let sql = 'CREATE DATABASE ABC';
//     db.query(sql, (err,result) => {
//         if(!err) {
//             console.log(result);
//             res.send('Database created...');
//         } else {
//             console.log(err);
//         }     
//     });
// });

app.post("/newentry", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const age = req.body.age;
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
 
    const mail = req.body.mail;
    const phone = req.body.phone;
    const address = req.body.address;
    var sql = "INSERT INTO USERS values(?,?,?,?,?,?,?,?);";
    db.query(sql,[null,fname,lname,age,date,mail,phone,address],(err,result)=>{
        if(err){
            console.log(err);
        } else{
            console.log('record inserted');
        }
    });
    res.render("newentry");
});

function myfunc() {
    alert("Oops! Wrong username or password");
}

app.post("/adminOption", (req, res) => {
    const uname = req.body.uname;
    const psw = req.body.psw;
    if(uname === "aaa" && psw === "123") {
        res.render("adminOption");
        // res.render("newentry");
    } else {
        res.send("Oops");
    }
});

app.get("/newentry",(req,res)=>{
    res.render("newentry");
});

app.get("/showEntries",(req,res)=>{
    db.query("SELECT * from USERS",(err,result,fields)=>{
        if(err) {
            res.send(err);
        }
        else{
            res.render("showEntries",{result:result});
        }
    });
});

app.post("/deleteEntry", (req, res) => {
    const phnum = req.body.phnum;
    db.query("DELETE FROM USERS where phone="+phnum+";", (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.redirect("/adminOption");
        }
    });
});


app.get("/bmi", (req, res) => {
    res.render("bmi");
});

app.post("/bmi", (req, res) => {
    const weight = req.body.weight;
    const height = req.body.height;
    const BMI = weight/(height*height);
    
    var status=1;
    if(BMI < 18.5){
        status = 0;   
    }
    else  if(BMI >=18.5 && BMI <= 24.9 ){
        status = 1;
    }
    else if(BMI >=24.9 && BMI <= 29.9){
        status = 2;
    }
    else{
        status = 3;
    }

    const sql = "SELECT wtstatus, recommendation from DIET where sno="+status+";";
    db.query(sql, (err, result, fields) => {
        if(err) {
            console.log(err);
        } else {
            res.render("dietPlans", { data : {BMI: BMI,wtstatus: result[0].wtstatus,result:result[0].recommendation}});
        }
    });
});


//diet plans 
app.get("/dietPlans",(req,res)=>{
    const wtstatus="NORMAL"
    const BMI = 20;   //default bmi 
    const result="Emphasize fruits, vegetables, whole grains, and fat-free or low-fat milk and milk products. Include a variety of protein foods such as seafood, lean meats and poultry, eggs, legumes (beans and peas), soy products, nuts, and seeds. Consume food which is low in added sugars, sodium, saturated fats, trans fats, and cholesterol. Stay within your daily calorie needs.";
    res.render("dietPlans",{data:{BMI:BMI,wtstatus:wtstatus,result:result}});
})

// gym items

const upload = multer({storage:multer.memoryStorage()});

app.get("/gymItems",(req,res)=>{
    res.render("gymItems");
});




app.get("/products",(req,res)=>{
    const sql = "SELECT * FROM GYMITEMS;";
    db.query(sql,(err,result,fields)=>{
        if(err) {
            res.send(err);
        }
        else{
            res.render("products",{products:result});
        }
    })

});

app.post("/gymItems",upload.single('ProductImage'),(req,res)=>{
   var image = req.file.buffer.toString('base64');
    var name = req.body.name;
    var use = req.body.use;
    console.log(name);
    const sql = "INSERT INTO GYMITEMS VALUES(NULL,?,NULL,?,?);"  //primary key,name,imagePath,imageHere,howToUse
    db.query(sql,[name,image,use],(err,result,fields)=>{
        if(err) console.log(err);
        else{
            console.log("image added to database");
            res.redirect("/products");
        }
    });
});

app.get("/contact",(req,res)=>{
    res.render("contact");
});

app.post("/contact",(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;
    const sql = "INSERT INTO FEEDBACK values (NULL,?,?,?,?)";
    db.query(sql,[name,email,phone,message],(err,result,fields)=>{
        if(err) console.log(err);
        else {
            console.log("feedback inserted");
            res.redirect("/");
        }
    });
});

app.get("/adminOption",(req,res)=>{
    res.render("adminOption");
});

app.get("/trainers",(req,res)=>{
    db.query("SELECT * from TRAINERS",(err,result,fields)=>{
        if(err) {
            res.send(err);
        }
        else{
            res.render("trainers",{result:result});
        }
    });
});

app.get("/addTrainer",(req,res)=>{
    res.render("addTrainer");
});
app.post("/addTrainer",(req,res)=>{
    var name=req.body.name;
    var speci=req.body.speci;
    var email=req.body.email;

    db.query("INSERT INTO TRAINERS VALUES (?,?,?,?)",[null,name,speci,email],(err,result)=>{
        if(err) console.log(err);
        else{
            res.redirect("/addTrainer");
        }
    });
})
app.post("/removeTrainer",(req,res)=>{
    const email = req.body.email;

    db.query("DELETE FROM TRAINERS WHERE EMAIL='"+email+"';",(err,result)=>{
        if(err) console.log(err);
        else{
            console.log(result.affectedRows+" deleted");
            res.redirect("/adminOption");
        }
    });
});

app.get("/user", (req, res) => {
    res.render("user");
});

app.get("/login",(req,res)=>{
    res.render("login",{message:""});
});

app.post("/signup",(req,res)=>{
    const name = req.body.name;
    const enteredemail = req.body.email;
    const enteredpasswd = req.body.passwd;
    
    db.query("SELECT * FROM LOGIN_CRED WHERE EMAIL='"+enteredemail+"';",(err,results,fields)=>{
        console.log(results.length);
        if(results.length !== 0){
            res.render("login",{message:"email already exist. Please login"});
        }
        else{
            bcrypt.hash(enteredpasswd, saltRounds,(err,hash)=> {
                console.log(hash);
                db.query("INSERT INTO LOGIN_CRED VALUES (?,?,?)",[name,enteredemail,hash],(error,result,fields)=>{
                    if(err) res.send(error);
                    else{
                        res.render("user",{data: {name:name, email:enteredemail, message:""}});
                    }
                });
            });        
        } 
    });  
});

app.post("/login",(req,res)=>{
    const enteredemail = req.body.email;
    const enteredpasswd = req.body.passwd;
    db.query("SELECT * FROM LOGIN_CRED WHERE EMAIL='"+enteredemail+"';",(err,result,fields)=>{
        if(result.length === 0){                    // if user doesnt have account,result will have empty set
            res.render("login",{message:"Accound doesn't exist. Create account"});
        }
        else{
            Object.keys(result).forEach(function(key){          //looping through each record (but result contains only one record)
                var row = result[key];         
                const hash = row.passwd;
                bcrypt.compare(enteredpasswd, hash, function(err, bres) {
                    if(bres == true){
                        res.render("user",{data: {name:row.name,email: row.email,message:""}});
                    }
                    else{
                        console.log(bres);
                        res.render("login",{message:"wrong password"});
                    } 
                });       
            });
        }   
    });
});

app.get("/showfeedback",(req,res)=>{
    db.query("SELECT * FROM FEEDBACK;",(err,results,fields)=>{
        res.render("showfeedback",{results:results});
    })
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

app.get("/paynow", (req, res)=> {
    res.render("paynow");
});

var instance = new Razorpay({
    key_id: 'rzp_test_6UGm13aOlZF5Sz',
    key_secret: 'Y7WvEJjXz4gumRoZxgxNf7RA',
});

app.post("/paynow", (req,res) => {

    console.log(req.body.xyz);
    console.log("create order Id request",req.body);
    var options = {
        amount: req,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
    };
    instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({orderId: order,id});
    });    
});

app.post("/api/payment/verify",(req,res)=>{ 

    console.log(req.body.response.razorpay_payment_id);
    let body= req.body.response.razorpay_payment_id;       //req.body.response.razorpay_order_id + "|" + 
    
    var crypto = require("crypto");
    var expectedSignature = crypto
    .createHmac('sha256', 'Y7WvEJjXz4gumRoZxgxNf7RA')
    .update(body.toString())
    .digest('hex');
    console.log("sig received " ,req.body.response.razorpay_signature);
    console.log("sig generated " ,expectedSignature);
    var response = {"signatureIsValid":"false"}
    if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
        res.send(response);
        
});


// key id = rzp_test_6UGm13aOlZF5Sz
// key secret = Y7WvEJjXz4gumRoZxgxNf7RA
