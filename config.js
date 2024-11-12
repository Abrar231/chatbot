import dotenv from 'dotenv'
dotenv.config();

const config = {
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    openaiApiKey: process.env.OPENAI_API_KEY,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseUrl: process.env.SUPABASE_URL
}

export default config;