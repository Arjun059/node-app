const express = require("express");
const app = express();
let port = process.env.PORT || 8200 ;

app.get('/', (req, res) => {
    res.send("Hello")
});
app.listen(8200, ()=>console.log(`http://loalhost:8200/`));