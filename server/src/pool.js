import Pool from "pg-pool";

const pool = new Pool({
    connectionString: process.env.DB_URL,
    // database: process.env.DB_DATABASE,
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // password: process.env.DB_PASSWORD,
    // port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000, // close idle clients after 10 second
    connectionTimeoutMillis: 60000, // return an error after 5 second if connection could not be established
    maxUses: 7500,
});

export default pool;