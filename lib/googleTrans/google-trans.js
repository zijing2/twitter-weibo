// const translate = require('google-translate-api');

// googleTranslate("hello world")
// .then((result)=>{console.log(result);})
// .catch((err)=>{console.log(err);});


// async function googleTranslate(sentence){
//     trans =  await translate(sentence, {to: 'zh-CN'});
//     return trans;
// }



const translate = require('translate-api');
 
//   let transUrl = 'https://nodejs.org/en/';
//   translate.getPage(transUrl).then(function(htmlStr){
//     console.log(htmlStr.length)
//   });
 
  let transText = 'hello world!';
  translate.getText(transText,{to: 'zh-CN'}).then(function(text){
    console.log(text)
  }).catch((err)=>{console.log(err);});