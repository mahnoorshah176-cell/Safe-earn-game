const API = 'http://localhost:4000/api';

let token = localStorage.getItem('token');

function qs(id){return document.getElementById(id)}
function msg(t){qs('msg').innerText=t}

async function api(url,method='GET',body){
  let opt={method,headers:{}}
  if(token) opt.headers.Authorization='Bearer '+token
  if(body){opt.headers['Content-Type']='application/json';opt.body=JSON.stringify(body)}
  let r=await fetch(API+url,opt)
  return r.json()
}

async function login(){
  let r=await api('/login','POST',{username:qs('username').value,password:qs('password').value})
  if(r.token){token=r.token;localStorage.setItem('token',token);load()}
  else msg('Login failed')
}

async function register(){
  let r=await api('/register','POST',{username:qs('username').value,password:qs('password').value})
  if(r.token){token=r.token;localStorage.setItem('token',token);load()}
}

async function load(){
  qs('auth').style.display='none'
  qs('app').style.display='block'
  let me=await api('/me')
  qs('userName').innerText=me.username
  qs('coins').innerText=me.coins
}

qs('login').onclick=login
qs('register').onclick=register
