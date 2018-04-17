var http = require('http');
var fs = require('fs');
var server = http.createServer();
var mime = require('mime');
var url = require('url');
var path =require('path');
var template= require('art-template');
// 设置请求
server.on('request',function(req,res){
//__dirname:指的是代码文件所在的路径
//__filename:指的是代码文件自己的路径
    //解析url为一个urlbj
    var urlObj = url.parse(req.url, true);
    //最后优化，模板路径不一样，要渲染的数据不一样
    function render(filename,data){
      fs.readFile(path.join(__dirname,'views',filename+'.html'),function(err,tplStr){
        var tplStr = tplStr.toString('utf-8');
          if(data){
            var renderTpl = template.compile(tplStr);
            tplStr = renderTpl(data);
          }
          res.end(tplStr);  
                        
      })
    }



    //首页数据的渲染
    if(req.url=="/index"){
         //当用户请求首页的时候，我们需要做3件事儿
        //1. 读文件
        //2. 渲染数据
        //3. 返回渲染结果给浏览器
        readNewsData(function(newsList){
            render(req.url,newsList)
         })
      //详情页面的渲染 
    }else if(req.url.indexOf('/details')==0){
         readNewsData(function(newsList){
            var id = urlObj.query.id;
            var news = newsList.find(function(v,i){
                return v.id==id;
           })
            render(urlObj.pathname,news);
           })
    }else if(req.url=='/submit'){
        render(req.url);
    }else if(req.url.indexOf('/resources')==0){
           res.setHeader('Content-Type',mime.getType(req.url))
           fs.readFile("." + req.url, function(err, data){
            res.end(data);
        })
    }else if(req.url.indexOf('/add')==0){
       
          var news = urlObj.query;

          readNewsData(function(newsList){
            news.id = newsList.length == 0 ? 0 : newsList[newsList.length-1].id + 1; 
            
            newsList.push(news);
            //写入数据 
            writeNewsData(newsList,function(err){
                if(err){
                    statusCode=505;
                }else{
                    res.statusCode = 302;
                    res.statusMessage = "Move temporarily";
                    res.setHeader("Location", "/index");
                    res.end();
                }
            
        })
          })
                
          
          
    }else{  
        // 设置404的路由
           res.statusCode=404;
           res.statusMessage='Not Found';
           res.setHeader('Content-Type','text/html');
           res.end("<img src='http://img.zcool.cn/community/015c4357764df30000012e7e576eae.jpg@1280w_1l_2o_100sh.jpg' />");
    }
    
   
      
});
// 监听请求
server.listen('9999',function(){
      console.log('http://localhost:9999');
})
//读取数据的封装
 function readNewsData(callback){
       fs.readFile(path.join(__dirname,'data.json'),function(err,data){
             var newsList=[];
             if(!err){
                   newsList = JSON.parse(data);
             }
             callback(newsList);
       })
 };
 //写入数据的封装
 function writeNewsData(newsArr,callback){
      fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(newsArr),callback);
 }


