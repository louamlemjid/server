const express =require("express");
const mongoose =require("mongoose");
const bodyparser=require("body-parser");

const app=express();
app.set('view engine','ejs');

let fruitlist=["banana","ananas","karmous"];
let fruitlist1=["brazil","asia","tunis"];
let fruitlist2=[0,1,2]
let commande=[];
mongoose.connect('mongodb://127.0.0.1:27017/fruitdb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
    },).then((res) => {
    console.log("Database connected");
    }).catch(error => {
     console.log(error);
});
const fruitdbschema=new mongoose.Schema({
    name:String,
    npage:Number,
    adresse:String
});
const Fruit=mongoose.model('Fruit',fruitdbschema);


app.use(bodyparser.urlencoded({extended:false}));

app.use(express.static("public"));
const db = mongoose.connection;



db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async function () {
  console.log('Connected to the database');

    //const appleData=new Fruit({name:"apple",npage:3,adresse:'tunsia'  });
    //const watermelonData=new Fruit({name:"watermelon",npage:2,adresse:'japan'  });
    //const teaData=new Fruit({name:"tea",npage:5,adresse:'thaiouan'  });
    //const karmousData=new Fruit({name:"karmous"})
    
    try {
        app.post("/",function(req,res){
            let inp=req.body.newItem;
            let inp1=req.body.newItem1;
            let inp2=req.body.newItem2;
            console.log(inp,inp1,inp2);
            let objeinData=new Fruit({name:inp,npage:inp2,adresse:inp1});
            
            objeinData.save();
            //push items: "inp,inp1,inp2" in fruitlis

            commande.push(inp,inp1,inp2);
            res.redirect("/");
        });
        const fruits = await Fruit.find(); // This returns a promise
        for (let j=0;j<fruits.length;j++){
            fruitlist.push(fruits[j].name);
            fruitlist1.push(fruits[j].npage);
            fruitlist2.push(fruits[j].adresse);
        };
        
        
        
        console.log(fruits);
        app.get('/',function(req,res){
            res.render("client",{
                louam: fruits[fruits.length-1].name,
                louam1: fruits[fruits.length-1].adresse,
                salem:fruits[fruits.length-2].name,
                salem1:fruits[fruits.length-2].adresse,
                nadhem:fruits[fruits.length-3].name,
                nadhem1:fruits[fruits.length-3].adresse,
                rihem:fruits[fruits.length-4].name,
                rihem1:fruits[fruits.length-4].adresse,
                allitems:fruitlist,
                allitems1:fruitlist1,
                allitems2:fruitlist2,
                statu:commande
            });
           
        });
        
        app.get('/admin',function(req,res){
            res.render("admin",{
                allitems:fruitlist,
                allitems1:fruitlist1,
                allitems2:fruitlist2
            });
           
        });
        
    } catch (err) {
        console.error(err);
    }
});

//Fruit.insertOne();

app.listen(3000,()=>{
    console.log("on port 3000")
})