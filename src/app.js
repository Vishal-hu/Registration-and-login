const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
require('./db/conn');

const Register = require('./models/registers');
const port = process.env.port || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', async(req, res) => {
    try {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {
            const userRegistration = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password,
                confirmpassword

            });

            const registered = await userRegistration.save();
            res.status(201).render('index');
        } else {
            res.send('Password not matching');
        }

    } catch (error) {
        res.status(404).send(error);
    }
});

app.post('/login', async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });
        // res.send(useremail.password);
        // console.log(useremail);

        if (useremail.password === password) {
            res.status(201).render('index')
        } else {
            res.status(400).send('Invalid login details');
        }


    } catch (error) {
        res.status(400).send('Invalid login details');
    }
});


app.listen(port, () => {
    console.log('listening to my server');
})