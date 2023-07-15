const bodyParser=require("body-parser");
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");
const url="mongodb://127.0.0.1:27017/todolistDB"
async function updateData(schema,filter,update){
    try{
       data=await schema.findOneAndUpdate(filter,update);
       console.log("data successfully updated!",data)
    }
    catch(e){
        console.log(err)
    }
}
async function findAllData(schema){
    try{
      const data=await schema.find({})
      return data
      /*data.forEach(dt=>{
        console.log(dt)
      })*/
    }
    catch(e){
      console.log(e)
    }
  }
  async function find(schema,condition){
    const data=await schema.findOne({name:condition}).exec()
    return data

  }

  async function deleteByID(schema,id){
    const data=await schema.findOneAndDelete({_id:id})
    console.log("data deleted successfully",data)
  }
try{
    mongoose.connect(url)
    console.log("Successfully connected .")
}
catch(e){
    console.log(e)
}
const itemsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});
const listSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    items:[itemsSchema]
})
const List=mongoose.model("list",listSchema);
const Item=mongoose.model("Item",itemsSchema)
const item1=new Item({
    name:"welcome to your todolist"
});
const item2=new Item({
    name:"hit the + button to add item"
});
const item3=new Item({
    name:"<-- hit to delete one"
});
const defaultItems=[item1,item2,item3]
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get('/',async function(request,response){
    const items=await findAllData(Item)
    if (items.length===0){
        Item.insertMany(defaultItems);
    }
    else{
        response.render("list",{listTitle:"Today",listOfTasks:items});
    }

});
app.post("/",async function(req,res){
    const itemName=req.body.task;
    const listName=req.body.list;
    const item=new Item({
        name:itemName
    })
    if(listName==="Today"){
        item.save()
        res.redirect('/')
    }
    else{
        data=await find(List,listName)
      
        data.items.push(item);
        data.save(); 
        console.log("data saved")
        res.redirect("/"+listName)
    }
    })
app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox
    const listName=req.body.listName;
    if(listName === "Today"){
        deleteByID(Item,checkedItemId)
        res.redirect("/")
    }
    else{
        updateData(List,{name:listName},{$pull:{items:{_id:checkedItemId}}})
        res.redirect("/"+listName)
    }

})
app.get("/:customListName",async function(req,res){
    const customListName=_.capitalize(req.params.customListName)
    console.log(customListName)
    const checklist=await find(List,customListName)
    if (checklist===null){
        const list=new List({
            name:customListName,
            items:defaultItems
        });
        list.save()
        res.redirect("/"+customListName)
    }
    else{
        res.render("list",{listTitle:checklist.name,listOfTasks:checklist.items})
    }
})
app.listen(3000,function(){
    console.log("The server is running on port 3000");
})