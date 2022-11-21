const  http = require('http')
const fs = require('fs')
const App = require('./app.js')
const querystring = require("querystring");
const  {read, wirete} = require('./read/read.js')
const PORT = process.env.PORT || 5000

function httpServer (req, res){
  const aps = new App(req, res)
  
  aps.GET('/news', (req, res)=>{
    let news = read('news')   
    let {id, title} = querystring.parse(req.query)
    let Filtred = news.filter(news => {
      let ByTittle = title ? news.title.toLowerCase().includes(title.toLowerCase()) : true
      let Byid = id ? news.id == id : true
      return Byid && ByTittle
    })
    if(Filtred.length){
      return res.end(JSON.stringify(Filtred));
    }
    res.end(JSON.stringify(news));
  })
  
  aps.post('/news', async (req, res) => {
    let news = read('news')
    let {title, body} = await req.body
    try {
      if(!(title.trim() && title.length >= 3)){
        throw new Error ('invalid title title length')
      }
      let newNews = {id:news.at(-1).id + 1 || 1, title: title, body : body, time: new Date() }
      news.push(newNews)
      wirete('news', news)
      res.writeHead(201, {'Content-Type' : 'application/json'})
      res.end(JSON.stringify({status:201, message:'you are news registred', data : newNews}))
    } catch (error) {
      res.writeHead(400, {'Content-Type' : 'application/json'})
      res.end(JSON.stringify({status:400, message:error.message}))
    }
  })
  
  
  aps.delete('/news', async  (req, res)=>{
    let news = read('news')
    let  {id} = await req.body 
    try {
      let iddele = news.findIndex((e)=> e.id == id)
      if(iddele == -1){
        throw new Error('news not found')
      }
      let delet = news.splice(iddele, 1)
      wirete('news', news)
      res.writeHead(200, {'Content-Type' : 'application/json'})
      res.end(JSON.stringify({status:200, message:'you are news delete', data : delet}))
    } catch (error) {
      res.writeHead(400, {'Content-Type' : 'application/json'})
      res.end(JSON.stringify({status:400, message:error.message}))
    }
    
    
  })
  
  aps.put('/news', async (req, res)=>{
    try {
      let news = read('news')
      let  {id, title, body} = await req.body 
      let find =  news.find(finded => finded.id == id)
      if(!id) {
        throw new Error('id not found')
      }if(title == '' || body == '') {
        throw new Error('title and body not found')
      }
      find.title = title
      find.body = body
      wirete('news', news)
      res.writeHead(200, {'Content-Type' : 'application/json'})
      res.end(JSON.stringify({status:200, message:'you are news PUT'}))
    } catch (error) {
      res.writeHead(400, {'Content-Type' : 'application/json'})
      res.end(JSON.stringify({status:400, message:error.message}))
    }
    
  })
}

const server = http.createServer(httpServer)
server.listen(PORT, ()=> console.log('okey'))
