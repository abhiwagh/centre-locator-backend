import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import centrLocatorRoutes from './routes/centreLocator.routes'

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (100 requests / 15 mins)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Routes
app.use("/api", centrLocatorRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
