const API='http://localhost:4000/api'
let token=localStorage.getItem('token')

function g(id){return document.getElementById(id)}
function msg(t){g('msg').innerText=t}

async function call(u,m='GET',b){
 let o={method:m,headers:{}}
 if(token)o.headers.Authorization='Bearer '+token
 if(b){o.headers['Content-Type']='application/json';o.body=JSON.stringify(b)}
 let r=await fetch(API+u,o)
 return r.json()
}

g('login').onclick=async()=>{
 let r=await call('/login','POST',{username:g('username').value,password:g('password').value})
 if(r.token){token=r.token;localStorage.setItem('token',token);load()}
 else msg('Login failed')
}

g('register').onclick=async()=>{
 let r=await call('/register','POST',{username:g('username').value,password:g('password').value})
 if(r.token){token=r.token;localStorage.setItem('token',token);load()}
}

async function load(){
 g('auth').style.display='none'
 g('app').style.display='block'
 let me=await call('/me')
 g('userName').innerText=me.username
 g('coins').innerText=me.coins
}
