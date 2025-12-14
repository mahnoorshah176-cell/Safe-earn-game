const express=require('express')
const body=require('body-parser')
const cors=require('cors')
const sqlite=require('sqlite3').verbose()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const app=express()
app.use(cors())
app.use(body.json())

const SECRET='mysecret123'
const db=new sqlite.Database('./data.db')

db.run(`CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT UNIQUE,
 password TEXT,
 coins INTEGER DEFAULT 50
)`)

function auth(req,res,next){
 const h=req.headers.authorization
 if(!h)return res.sendStatus(401)
 jwt.verify(h.split(' ')[1],SECRET,(e,u)=>{
  if(e)return res.sendStatus(403)
  req.user=u
  next()
 })
}

app.post('/api/register',async(req,res)=>{
 const p=await bcrypt.hash(req.body.password,10)
 db.run("INSERT INTO users(username,password) VALUES(?,?)",
 [req.body.username,p],
 e=> e?res.send({error:1}):
 res.send({token:jwt.sign({u:req.body.username},SECRET)})
 )
})

app.post('/api/login',(req,res)=>{
 db.get("SELECT * FROM users WHERE username=?",
 [req.body.username],async(e,u)=>{
  if(!u)return res.send({error:1})
  const ok=await bcrypt.compare(req.body.password,u.password)
  if(!ok)return res.send({error:1})
  res.send({token:jwt.sign({u:u.username},SECRET)})
 })
})

app.get('/api/me',auth,(req,res)=>{
 db.get("SELECT username,coins FROM users WHERE username=?",
 [req.user.u],(e,u)=>res.send(u))
})

app.listen(process.env.PORT||4000)
