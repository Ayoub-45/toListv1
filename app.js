const bodyParser=require("body-parser");
const express=require("express");
const app=express();
app.set("view engine","ejs");
let tasks=[];
let workItems=[]
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
    response.render("list",{listTitle:day,listOfTasks:tasks});

});
app.post("/",function(req,res){
    const task=req.body.task;
    console.log(req.body)
    if(req.body.list==="Work"){
        workItems.push(task);
        res.redirect("/work")
    }
    else{
        tasks.push(task)
        res.redirect("/");
    }
    })

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work list",listOfTasks:workItems })
})
/*
app.post("/work",function(req,res){
    let task=req.body.task;
    workItems.push(task)
    res.redirect("/work")
})
*/
app.listen(3000,function(){
    console.log("The server is running on port 3000");
})