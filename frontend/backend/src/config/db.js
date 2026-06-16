const mongoose= require('mongoose')
async function main() {
    const uri = process.env.DB_CONNECT_STRING;
    if (!uri) {
        throw new Error('Missing required environment variable: DB_CONNECT_STRING');
    }
    await mongoose.connect(uri);
}

module.exports = main;


