const fs = require('fs')
const url = require('url')

class App{
  constructor(req, res){
    this.req = req
    this.res = res
    if(this.req.method != 'GET'){
      this.req.body = new Promise( (resol, rejekt)=> {
        let str = ''
        this.req.on('data', chunk => str += chunk)
        this.req.on('end', ()=>{
          resol(JSON.parse(str))
        })
      })
    }
  }
  
  GET  (route, callbak){
    let { pathname, query } = url.parse(this.req.url)
    this.req.query =  query
    if(pathname == route && this.req.method == "GET") {
      callbak(this.req, this.res)
    }
  }
  
  
  post(route, callbak){
    if(this.req.url == route && this.req.method == "POST") {
      callbak(this.req, this.res)
    }
  }

  put(route, callbak){
    if(this.req.url == route && this.req.method == "PUT") {
      callbak(this.req, this.res)
    }
  }
  
  delete(route, callbak){
    if(this.req.url == route && this.req.method == "DELETE") {
      callbak(this.req, this.res)
    }
  }
  
  
  Signpost(route, callbak){
    let users = fs.readFileSync('users.json', 'utf-8')
    users = JSON.parse(users)
    users.filter((e)=>{
      if(e.name == route.name && e.Password == route.Password){
        callbak()
      }else{
        this.res.end('akkaunt topilmadi')
      }
    })
  }
}


module.exports = App