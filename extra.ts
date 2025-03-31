import express from 'express';

export function registerExtraOperations(app: express.Express) {
    app.get('/api/available-models', (req, res) => {
        const brand = req.query.brand as string;

        const validBrands = [
            "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "BMW", "Mercedes-Benz", "Volkswagen"
        ];

        if (!brand || !validBrands.includes(brand)) {
            res.status(400).json({ success: false, message: "The given brand does not exists." });
            return;
        }

        const models = ["Xenon", "Vortex", "Stratos", "Nimbus", "Eclipse", "Solstice", "Titan", "Aether", "Quantum"];
        const shuffled = models.sort(() => 0.5 - Math.random());

        res.json(shuffled.slice(0, 1 + Math.floor(Math.random() * (models.length - 1))));
    });

    app.get('/api/validate-license-plate', (req, res) => {
        const plate = req.query.plate as string;

        const pattern = /^[A-Z]{3,4}-?\d{3}$/;
        const match = pattern.test(plate);

        res.json({ valid: match, message: match ? 'It is a valid license plate number.' : 'Invalid license plate number.' });
    });

    app.get('/api/fuel-log', (req, res) => {
        const licensePlate = req.query.licensePlate as string;

        const validLicensePlates = ['ABC-123', 'TEST-666', 'BELA-112'];

        if (!licensePlate || !validLicensePlates.includes(licensePlate)) {
            res.status(404).json({ success: false, message: 'License plate number is not exists.' });
            return;
        }

        res.json([
            { "date": "2025-03-24", "liters": 12, "kmDriven": 160 },
            { "date": "2025-03-25", "liters": 15, "kmDriven": 200 },
            { "date": "2025-03-26", "liters": 10, "kmDriven": 130 },
            { "date": "2025-03-27", "liters": 18, "kmDriven": 250 },
            { "date": "2025-03-28", "liters": 14, "kmDriven": 180 },
            { "date": "2025-03-29", "liters": 20, "kmDriven": 270 },
            { "date": "2025-03-30", "liters": 11, "kmDriven": 140 },
            { "date": "2025-03-31", "liters": 0, "kmDriven": 0 }
        ]);
    })

    app.get('/api/driver-ratings', (req, res) => {
        const lowerLimit = parseFloat(req.query.limit as string);

        if (isNaN(lowerLimit) || lowerLimit < 0 || lowerLimit > 5) {
            res.status(400).json({ success: false, message: 'Lower limit should be a number between 0 and 5.' });
            return;
        }

        const drivers = [
            { "name": "Alice Johnson", "rating": 3.5 },
            { "name": "Bob Williams", "rating": 4.2 },
            { "name": "Charlie Brown", "rating": 4.7 },
            { "name": "David Lee", "rating": 3.9 },
            { "name": "Eva Green", "rating": 4.8 },
            { "name": "Frank Harris", "rating": 2.3 },
            { "name": "Grace Wilson", "rating": 4.6 },
            { "name": "Henry Clark", "rating": 1.4 },
            { "name": "Ivy Adams", "rating": 0.0 },
            { "name": "Jack Taylor", "rating": 4.9 }
        ];

        res.json(drivers.filter(driver => driver.rating >= lowerLimit));
    });

    app.get('/api/customers', (req, res) => {
        const query = req.query.search as string;

        if (!query) {
            res.status(400).json({ success: false, message: 'Customer name should be defined for performing the search.' });
            return;
        }

        const customers = [
            { "name": "John Smith", "email": "johndoe@example.com", "phone": "1234567890" },
            { "name": "Jane Smith", "email": "janesmith@example.com", "phone": "0987654321" },
            { "name": "Michael Johnson", "email": "michael.johnson@example.com", "phone": "1122334455" },
            { "name": "Emily Taylor", "email": "emily.davis@example.com", "phone": "2233445566" },
            { "name": "David Taylor", "email": "david.brown@example.com", "phone": "3344556677" },
            { "name": "Sarah Wilson", "email": "sarah.wilson@example.com", "phone": "4455667788" },
            { "name": "James Taylor", "email": "james.taylor@example.com", "phone": "5566778899" },
            { "name": "Patricia Moore", "email": "patricia.moore@example.com", "phone": "6677889900" },
            { "name": "Michael Lee", "email": "michael.lee@example.com", "phone": "7788990011" },
            { "name": "Michael Davis", "email": "michael.davis@example.com", "phone": "8899001122" }
        ];

        res.json(customers.filter(customer => customer.name.includes(query)));
    });
}