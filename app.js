const express = require("express");
const app = express();
let PORT = process.env.PORT || 8200 ;

app.get('/', (req, res) => {
    res.send("Hello, How are you")
});
app.listen(PORT, ()=>console.log(`http://localhost:${PORT}/`));