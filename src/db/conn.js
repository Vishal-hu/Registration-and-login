const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Vishal:Vishal@12345@cluster0.xmemq.mongodb.net/registration?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connection successful')
}).catch((e) => {
    console.log(e);
})

// mongodb://localhost:27017/registration
// mongodb+srv://Vishal:<password>@cluster0.xmemq.mongodb.net/test
// mongodb+srv://Vishal:<password>@cluster0.xmemq.mongodb.net/<dbname>?retryWrites=true&w=majority
// mongodb+srv://Vishal:<password>@cluster0.xmemq.mongodb.net/<dbname>?retryWrites=true&w=majority