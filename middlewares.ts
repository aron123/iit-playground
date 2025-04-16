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

export const handleSyntaxError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError) {
        logger.error(`Syntax error in body:`, err);
        res.status(400).json({
            success: false,
            message: 'Syntax error: Request body should contain a valid JSON object.'
        });
    }
}

export const handleGenericError = (err: any, req: any, res: any, next: any) => {
    logger.error(`Unexpected error occurred: ${err.message}`, err);
    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
    });
}

export const allowCors = (req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        // No content response for preflight
        return res.sendStatus(204);
    }

    next();
};
