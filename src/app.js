require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('./db/conn');
const auth = require('./middleware/auth');
const Register = require('./models/registers');
const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/secret', auth, (req, res) => {

    res.render('secret');
    // console.log(`This is my cookie ${req.cookies.jwt1}`);
});

app.get('/logout', auth, async(req, res) => {
    try {
        //for single logout
        // req.user.tokens = req.user.tokens.filter((currElem) => {
        //     return currElem.token != req.token;
        // });

        //logout from all devices
        req.user.tokens = [];

        res.clearCookie('jwt1');
        console.log('logout successfully');
        await req.user.save();
        res.render('register');
    } catch (error) {
        res.status(500).send(error);
    }
})

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

            const token = await userRegistration.generateAuthToken();
            console.log(token);

            res.cookie('jwt1', token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            })
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
        const isMatch = await bcrypt.compare(password, useremail.password);
        // useremail.password === password
        const token = await useremail.generateAuthToken();
        console.log(token);

        res.cookie('jwt1', token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
                //secure:true --works only with https
        });


        if (isMatch) {
            res.status(201).render('index')
        } else {
            res.status(400).send('Invalid login details');
        }


    } catch (error) {
        res.status(400).send('Invalid login details');
    }
});


// const securePassword = async(pass) => {
//     const hashpassword = await bcrypt.hash(pass, 10);
//     console.log(hashpassword);
//     const matchpassword = await bcrypt.compare(pass, hashpassword);
//     console.log(matchpassword);
// }
// securePassword("Vishal");

// const createtoken = async() => {
//     const token = await jwt.sign({ _id: '60145ad7d35d3f43c0c84eed' }, 'mynameisvishaliamagoodboyiamproudofme', {
//         expiresIn: '5 seconds'
//     })
//     console.log(token);
//     const tokenvarified = await jwt.verify(token, 'mynameisvishaliamagoodboyiamproudofme');
//     console.log(tokenvarified);
// }
// createtoken();

app.listen(port, () => {
    console.log('listening to my server');
})