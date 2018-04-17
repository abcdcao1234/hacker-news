var obj ={
     name:'zs',
     age:18,
     status:1
};
var template = require('art-template');
var path = require('path');
//使用art-template渲染文件的模板
// template('模板文件的路径',要渲染的数据)
// var result = template(path.join(__dirname,'tmp.art'),obj);


// 使用art-template渲染字符串模板
var str = "<div>我叫{{name}}，我今年{{age}}岁，我{{status}}</div>"
//先通过template.compile方法利用模板字符串生成一个渲染函数
var render =template.compile(str);
var result = render(obj);
console.log(result);