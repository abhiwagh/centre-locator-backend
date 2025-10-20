import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/db.config"

dotenv.config();
const PORT = process.env.PORT || 3000; // Use a common port like 3000 for local dev

// --- CRITICAL CHANGE FOR VERCEL COMPATIBILITY ---
// Use CommonJS export to ensure Vercel reliably finds the handler.
module.exports = app;
// ------------------------------------------------

if (process.env.VERCEL_ENV !== 'production') {
    (async () => {
        try {
            await sequelize.authenticate();
            console.log("✅ Connected to PostgreSQL database.");

            app.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}`);
            });
        } catch (err: any) {
            console.error("Database connection failed:", err.message);
            process.exit(1);
        }
    })();
}