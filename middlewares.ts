import { Database } from "./database";
import { logger } from "./logger";

const db = Database.instance();

export const checkNeptun = (req: any, res: any, next: any) => {
    const neptun = req.params.neptun;

    if (!neptun || !db.checkNeptunCode(neptun)) {
        return res.status(401).json({ success: false, message: `The given Neptun code does not exist: ${neptun}` });
    }

    next();
};

export const sanitizeNeptun = (req: any, res: any, next: any) => {
    req.params.neptun = String(req.params.neptun).toUpperCase();
    next();
};

export const handleGenericError = (err: any, req: any, res: any, next: any) => {
    logger.error(`Unexpected error occurred: ${err.message}`, err);
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
    });
}