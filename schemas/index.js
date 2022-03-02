const mongoose = require('mongoose')
const { mongodbUrl } = process.env

const connect = () => {
    mongoose
        .connect(mongodbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ignoreUndefined: true,
        })
        .then(() => console.log('MongoDB Connected', new Date()))
        .catch((err) => console.log(err))
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB Connection Error', err)
})

module.exports = connect
