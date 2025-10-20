import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { CentreQuery, CentreService, SearchOptionQuery } from "../service/centreLocator.service";

export const getCentresController = async (
    req: Request & { validatedQuery?: CentreQuery },
    res: Response,
    next: NextFunction
) => {
    try {
        const query = req.validatedQuery!;
        const centres = await CentreService.getCentres(query);
        return ApiResponse.success(res, centres);
    } catch (err) {
        next(err);
    }
};

export const getSearchOptionsController = async (
    req: Request & { validatedSearchQuery?: SearchOptionQuery },
    res: Response,
    next: NextFunction
) => {
    try {
        const query = req.validatedSearchQuery!;

        const centres = await CentreService.getSearchOptions(query);
        return ApiResponse.success(res, centres);
    } catch (err) {
        next(err);
    }
};
