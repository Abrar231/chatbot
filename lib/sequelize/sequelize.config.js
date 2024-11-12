import dotenv from 'dotenv';
dotenv.config();

const config = {
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
}

export default config;