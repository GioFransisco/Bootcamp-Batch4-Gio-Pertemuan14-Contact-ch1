const express = require('express')
const func = require('./callfunction')
const app = express()
// const bodyParser = require('body-parser')
const path = require('path');
// const morgan = require('morgan')
const expressLayout = require('express-ejs-layouts');
const { name } = require('ejs');
const port = 3000

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended : true}))

// parse application/json
// app.use(bodyParser.json())

//information using EJS
app.set('view engine', 'ejs')

//using third party express layout
app.use(expressLayout)

// app.use(morgan('dev'))

//fungsi middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

//untuk memanggil file static (contoh kasus disini adalah untuk memanggil file gambar yang  )
app.use(express.static(path.join(__dirname, 'public')))

// app.set('layout','layouts/layout')
// routing untuk path pada browser
app.get('/', (req,res) => {
  res.render('index', {
    layout : "layouts/main",
    title : "Halaman Index"
  })
})

//routing untuk path pada browser
app.get('/about', (req, res) => {
  res.render('about', {
    layout : "layouts/main",
    title : "Halaman About"
  })
})

//routing untuk path pada browser
app.get('/contact', (req, res) => {
  const cont = func.readJSON()
  console.log(cont); //opsional
  res.render('contact', {
    layout : "layouts/main",
    title : "Halaman Contact",
    cont,
  })
})

//routing untuk path add contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout : "layouts/main",
    title : "Add new contact"
  })
});

app.post('/add', (req, res) => {
  console.log(req.body);
  const name = req.body.name
  const phone = req.body.phone
  const email = req.body.email
  func.data_add(name, email, phone)
  res.redirect('/contact')
});

//routing untuk path pada browser
app.get('/contact/:name', (req, res) => {
  //untuk mengirimkan nilai ke parameter dengan menggunakan req.params (contoh kasus disini menggunakan :name)
  const cont = func.findContact(req.params.name) 
  const url = req.params.name
  res.render('detail', {
    layout : "layouts/main",
    title : "Halaman Detail",
    cont,
    url
  })
})

//route untuk menunjukkan status code 404 jika path url tidak ditentukan
app.use('/', (req, res) => {
  res.status(404)
  res.send('page not found')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})  