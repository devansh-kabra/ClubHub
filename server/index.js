import app from "./src/App.js";
import 'dotenv/config';
import pool from "./src/pool.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server running on port " + port);
});

async function shutdown() {
    console.log("Server shutting down! Closing database pool");
    await pool.end();

    console.log("Server closed successfully");
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);