
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static('public'))


// Route Handlers
app.get('/', (req, res)=>{
    res.render('index.ejs')
})




//Listener

app.listen(PORT, ()=> console.log(`App listening on ${PORT}`))