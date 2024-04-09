const dotenv = require('dotenv')
const connectDatabase = require('./database/connection.js')
const app = require('./app.js')

dotenv.config({
    path: "./.env",
});

connectDatabase()
    .then(() =>
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server listening on ${process.env.PORT}`);
        })
    )
    .catch((error) => {
        console.log(`MongoDB connection error: ${error}`);
    });
