const bodyParser=require("body-parser");
const express=require("express");
const app=express();
app.set("view engine","ejs");
let tasks=[];
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get('/',function(request,response){
    const today=new Date();
    const currentDay=today.getDay();
    const options={
       weekday:"long",
       day:"numeric",
       month:"long" 
    }
    const day=today.toLocaleDateString("en-US",options);
    response.render("list",{kindOfday:day,listOfTasks:tasks});

});
app.post("/",function(req,res){
    const task=req.body.task;
    tasks.push(task)
    res.redirect("/");
})


app.listen(3000,function(){
    console.log("The server is running on port 3000");
})