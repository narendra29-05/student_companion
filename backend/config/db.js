const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load env vars early so models can import this module safely
dotenv.config();

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    })
    : new Sequelize(
        process.env.DB_NAME || 'student_companion',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || '',
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        }
    );

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
