const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require('express');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//generating token
employeeSchema.methods.generateAuthToken = async function() {
    try {
        console.log(this._id);
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
        console.log(token);
    } catch (error) {
        response.send(error);
    }
}

//hashing password
employeeSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        console.log(`Password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`New password ${this.password}`);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})

const Register = new mongoose.model('Register', employeeSchema);
module.exports = Register;