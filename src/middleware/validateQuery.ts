import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Extend Request interface to add validatedQuery
declare module "express-serve-static-core" {
    interface Request {
        validatedQuery?: {
            name?: string;
            type_id?: number;
            class_type?: string;
            location: string;
            latitude?: number;
            longitude?: number;
            radius_km?: number;
            centre_id?: number;
            limit: number;
            offset: number;
        };
    }
}

export const validateQuery = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = Joi.object({
        name: Joi.string().optional(),
        type_id: Joi.number().optional(),
        class_type: Joi.string().optional(),
        location: Joi.string().required(),
        latitude: Joi.string().optional(),
        longitude: Joi.string().optional(),
        radius_km: Joi.string().optional(),
        centre_id: Joi.number().optional(),
        limit: Joi.number().integer().min(1).max(1000).default(10),
        offset: Joi.number().integer().min(0).default(0),
    }).custom((value, helpers) => {
        const { latitude, longitude, radius_km, centre_id } = value;

        const anyProvided = latitude || longitude || radius_km || centre_id;

        if (anyProvided) {
            if (!latitude || !longitude || !radius_km || !centre_id) {
                return helpers.error("any.custom", {
                    message: "latitude, longitude, radius_km, and centre_id must all be provided together",
                });
            }
        }

        return value;
    }, "Conditional validation for nearby centres");

    const { error, value } = schema.validate(req.query, { stripUnknown: true });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    // ✅ Store validated query separately
    req.validatedQuery = value;

    next();
};

// Extend Request interface to add validatedSearchQuery
declare module "express-serve-static-core" {
  interface Request {
    validatedSearchQuery?: {
      name: string;
      type_id: number;
      location: string; // optional if you want
    };
  }
}

export const validateSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type_id: Joi.number().required(),
    location: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.query, { stripUnknown: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  // ✅ Store validated query separately
  req.validatedSearchQuery = value;

  next();
};

