const express = require("express");
const app = express();

app.get('/', (req, res) => {
    res.send("Hello")
});
app.listen(8200, ()=>console.log(`http://loalhost:8200/`));