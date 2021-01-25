const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/registration", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connection successful')
}).catch((e) => {
    console.log(e);
})