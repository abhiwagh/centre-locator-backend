import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/db.config"

dotenv.config();
const PORT = process.env.PORT || 2804;

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
