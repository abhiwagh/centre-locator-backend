import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/db.config"

dotenv.config();
const PORT = process.env.PORT || 2804;

export default app;

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
            // Optionally, remove process.exit(1) if you want the app to run locally even without the DB, but usually you want it to fail.
            process.exit(1);
        }
    })();
}
