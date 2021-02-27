const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000


// Route Handlers
app.get('/', (req, res)=>{
    res.render('index.ejs')
})




//Listener

app.listen(PORT, ()=> `App listening on ${PORT}`)