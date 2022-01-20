const express = require("express");
const router = express.Router()
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
String.prototype.replaceFromZeroTo = function(index, replacement) {
    var text = this
  for (var i = 0;i < index;i++){
    text = text.replaceAt(i,replacement)
  }
  return text.replace(/\s/g,'')
}
function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
app.use("/get",
  router.get("/cookie",function(req, res){
  var query_cookie = `${req.query.query_cookie}`
  axios.get(`${req.query.domain}`)
    .then(response => eval(`res.send(response.${query_cookie})`));
}),
  router.get("/urlHaveCookie",function(req, res){
    var url = req.originalUrl
    var urlCors = url.replaceFromZeroTo(136," ")
    var urlCookie = url.replaceFromZeroTo(30," ").replace("&url="+urlCors," ").replace(/\s/g,'')
    var query_cookie = `${req.query.query_cookie}`
    axios.get(`${urlCookie}`)
      .then(response => {
        const cookie = response.data
        axios.get(`${urlCors}`,{
          headers: {
            Cookie: `${cookie}`,
          },
        })
          .then(data => res.send(data.data))
      });
}))
app.get('*',function(req,res){
  var urlCors = req.originalUrl.replaceAt(0, " ").replace(/\s/g,'')
  if(isValidHttpUrl(urlCors)){
    axios.get(urlCors)
      .then(data => res.send(data.data));
  }else if(urlCors.length === 0){
    res.send("nothing")
  }
})
app.listen(port, () => {
  console.log(`Start server listen at http://localhost:${port}`);
});