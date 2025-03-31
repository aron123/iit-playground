import express from 'express';
import { logger } from './logger';
import { Database } from './database';
import { allowCors, checkNeptun, handleGenericError, sanitizeNeptun } from './middlewares';
import { sanitizeCar } from './schema';
import { registerExtraOperations } from './extra';

const app = express();
const db = Database.instance();

app.use(express.static('public'));

app.use(allowCors);

app.use('/api', express.json({ limit: '2mb' }));

app.use('/api/:neptun', checkNeptun);

app.get('/api/:neptun/car', sanitizeNeptun, (req, res) => {
    const neptun = req.params.neptun;

    logger.info(`Listing all cars (${neptun})`);

    res.json(db.carsOf(req.params.neptun));
});

app.get('/api/:neptun/car/:id', sanitizeNeptun, (req, res) => {
    const neptun = req.params.neptun;
    const carId = parseInt(req.params.id);

    logger.info(`Listing car with unique ID (${neptun}, ${carId})`);

    if (isNaN(carId)) {
        res.status(400).json({
            success: false,
            message: `Invalid identifier is given: ${req.params.id}`
        });
        return;
    }

    const carFound = db.carBy(neptun, carId);
    if (!carFound) {
        res.status(404).json({
            success: false,
            message: `No car is found with the given id: ${carId}`
        })
        return;
    }

    res.json(carFound);
});

app.post('/api/:neptun/car', sanitizeNeptun, (req, res) => {
    const neptun = req.params.neptun;
    const MAX_CARS_PER_STUDENT = 10;

    logger.info(`Creating new car (${neptun})`);

    if (db.carsOf(neptun).length >= MAX_CARS_PER_STUDENT) {
        res.status(400).json({
            success: false,
            message: `A maximum of ${MAX_CARS_PER_STUDENT} cars can be stored per student.`
        });
        return;
    }

    try {
        const car = sanitizeCar(req.body);
        const savedCar = db.saveCar(neptun, car);
        res.json(savedCar);
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err
        });
        return;
    }
});

app.put('/api/:neptun/car', sanitizeNeptun, (req, res) => {
    const neptun = req.params.neptun;

    logger.info(`Updating car (${neptun})`);

    let car;

    try {
        car = sanitizeCar(req.body);
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err
        });
        return;
    }

    if (!db.carBy(neptun, car.id)) {
        res.status(404).json({
            success: false,
            message: `No car exists with the given id: ${car.id}`
        })
        return;
    }

    const updatedCar = db.updateCar(neptun, car);

    res.json(updatedCar);
});

app.delete('/api/:neptun/car/:id', sanitizeNeptun, (req, res) => {
    const neptun = req.params.neptun;
    const carId = parseInt(req.params.id);

    logger.info(`Deleting car (${neptun}, ${carId})`);

    const success = db.deleteCar(neptun, carId);

    if (!success) {
        res.status(404).json({
            success: false,
            message: `No car is found with the given id: ${carId}`
        });
        return;
    }

    res.json({ success: true });
});

registerExtraOperations(app);

app.use(handleGenericError);

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        return logger.error(`Cannot start server: ${err}`);
    }

    logger.info(`Server started in "${process.env.NODE_ENV}" mode, using port ${port}`);
});
