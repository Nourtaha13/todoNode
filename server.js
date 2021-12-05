const express = require("express")
const path = require("path")
const jwt = require("json-web-token")
const { connect, disConnect } = require("./database/db")
const app = express()
const PORT = 5000


app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.set("view engine", "ejs")
app.set("views")
app.get("/", async (req, res, next)=>{
    await connect()
    								.then( async (db) =>{
    										 let collection = await db.collection("users")
    										await  collection.find({}).toArray(async (err, data)=>{
    				 					      
    				 					     await res.render('index', { data });
    				 					     
    				 					 })
    								})
    							 .catch(err =>{
    							 				console.log("MongoDB off..")
    							 				throw  err
    							 })
    	return;

})

app.post("/add", (req, res)=>{
				const { user, email, sub } = req.body
				if (!user && !email && !sub){
								res.redirect("/")
				}else{
							 
							 connect()
							          .then(db =>{
							          				const collection = db.collection("users")
							              collection.insertOne({
							              				_id: Math.floor(new Date() / 100 ),
							              				user,
							              				email,
							              				sub,
							              				create_At: new Date().toLocaleString(),
							              				update_At: new Date().toLocaleString()
							              })
							              .then(result =>{      				   
							              								return res.redirect("/")
							              })
							              .catch(err =>{
							              				throw err
							              })
							              
							          })
							          .catch(err =>{
							          				console.error(err)
							          				disConnect()
							          })
							 
							 
				}
})
app.get("/add",(req, res)=>{
				res.redirect("/")
				
})
app.get("/remove", async (req, res)=>{
				const id = +req.query.id
				await connect()
																.then(db =>{
																				const collection = db.collection("users")
																    collection.deleteOne({_id:id})
																  
																    .then(result =>{
																          if(result){
																          				res.redirect("/")
																          				disConnect()
																          }else{
																          				res.redirect("/")
																          				disConnect()
																          }
																    
																    })
																})
																.catch(err => {
																				disConnect()
																				console.error(err)
																				
																				})
			 
})

app.get("/update", async (req, res)=>{
				const id = +req.query.id
				await connect()				
																.then(db =>{
																				const collection = db.collection("users")
																				collection.findOne({_id: id})
																								.then(result =>{
																												if(result){
																																res.render("update", {result})
																												}else{
																																
																																res.redirect("/")
																												}
																												
																								})
																								.catch(err =>{
																												
																												console.error(err)
																								})
																})
																.catch(err =>{
																				console.error(err)
																})
				
				
				
				
})

app.post("/update", async (req, res)=>{
				const id = +req.query.id
				const { user, email, sub } = req.body
				await connect()
																.then(db =>{
																				db.collection("users").updateOne({_id:id}, 
																							{$set: {
																								user,
																								email,
																								sub,
																								update_At: new Date().toLocaleString()
																				}})
																				.then(result =>{
																								if(result){
																												disConnect()
																												res.redirect("/")
																								}else{
																												res.redirect("/")
																								}
																				})
																				.catch(err =>{
																								console.error(err)
																				})
																})
																.catch(err =>{
																				console.error(err)
																})
})
app.use("*", (req, res)=>{
				res.send("<h1 style='color: red; margin:10px auto;'>Not found</h1>")
})
app.listen(PORT, ()=>{
				console.clear()
    console.log(`Starting .. (http://localhost:${PORT})`)
})




