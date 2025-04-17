import { logger } from "./logger";
import { Car, DatabaseCounter, TaxiCompanyDatabase } from "./schema";

const DEFAULT_CARS_NUM = 5;

export class Database {
    private static _instance: Database;

    private validNeptunCodes: string[] = process.env.NODE_ENV == 'production' ? [] : ['TEST01'];

    private db: TaxiCompanyDatabase = {};

    private counter: DatabaseCounter = {};

    private constructor() {
        if (process.env.NODE_ENV == 'production' && !process.env.NEPTUN_CODES) {
            throw "Error: No Neptun codes defined.";
        }

        if (process.env.NODE_ENV == 'production') {
            this.validNeptunCodes = String(process.env.NEPTUN_CODES).split(',');
        }

        logger.info(`Registered Neptun codes: ${this.validNeptunCodes}`);
        logger.info('Database is created.');
    }

    public static instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
            Database._instance.initialize();
        }
        return Database._instance;
    }

    public checkNeptunCode(neptunCode: string): boolean {
        return this.validNeptunCodes.findIndex((code) => code.toLowerCase() === neptunCode.toLowerCase()) > -1;
    }

    public carsOf(neptunCode: string): Car[] {
        return this.db[neptunCode] || [];
    }

    public carBy(neptunCode: string, id: number): Car | undefined {
        const cars = this.db[neptunCode];
        return cars?.find((car) => car.id === id);
    }

    public saveCar(neptunCode: string, car: Car): Car {
        car.id = this.counter[neptunCode]++;
        this.db[neptunCode].push(car);
        return car;
    }

    public updateCar(neptunCode: string, car: Car): Car {
        let carFound = this.carBy(neptunCode, car.id);
        if (carFound) {
            const index = this.db[neptunCode].indexOf(carFound);
            if (index > -1) {
                this.db[neptunCode][index] = { ...car };
            }
        }
        return car;
    }

    public deleteCar(neptunCode: string, id: number): boolean {
        const carFound = this.carBy(neptunCode, id);
        if (!carFound) {
            return false;
        }

        const idx = this.db[neptunCode].indexOf(carFound);
        if (idx < 0) {
            return false;
        }

        this.db[neptunCode].splice(idx, 1);
        return true;
    }

    public randomCar(neptunCode: string): Car {
        const brands: Car['brand'][] = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
            'Volkswagen', 'Audi', 'Hyundai', 'Kia', 'Subaru', 'Lexus', 'Mazda', 'Tesla',
            'Jeep', 'Porsche', 'Volvo', 'Jaguar', 'Land Rover', 'Mitsubishi', 'Ferrari', 'Lamborghini'];
        const models = [
            "Xenon", "Vortex", "Stratos", "Nimbus", "Eclipse", "Solstice", "Titan", "Aether", "Quantum", "Nebula",
            "Synergy", "Omicron", "Astra", "Zenith", "Fusion", "Hyperion", "Orion", "Celestia", "Spectra", "Nova",
            "Pulsar", "Eon", "Velocity", "Onyx", "Draco", "Lyra", "Infinity", "Mirage", "Raptor", "Horizon"
        ];
        const electric = Math.random() < 0.33;
        const hungarianFirstNames = [
            "Bálint", "Csaba", "Dániel", "Ferenc", "Gergely", "László", "Miklós", "Norbert", "Péter", "Zoltán",
            "Ágnes", "Blanka", "Csilla", "Eszter", "Fruzsina", "Hajnalka", "Katalin", "Melinda", "Réka", "Zsófia"
        ];
        const hungarianLastNames = [
            "Kovács", "Szabó", "Tóth", "Horváth", "Varga", "Kiss", "Nagy", "Farkas", "Molnár", "Balogh",
            "Papp", "Takács", "Juhász", "Mészáros", "Szekeres", "Fekete", "Lukács", "Hegedűs", "Oláh", "Csák"
        ];

        return {
            id: 0, // will be set on saving
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            electric,
            fuelUse: electric ? 0 : Math.random() * 20,
            dayOfCommission: this.randomDate(),
            owner: hungarianLastNames[Math.floor(Math.random() * hungarianLastNames.length)]
                + ' ' + hungarianFirstNames[Math.floor(Math.random() * hungarianFirstNames.length)]
        }
    }

    private randomDate(startYear: number = 2020, endYear: number = 2025): string {
        const start = new Date(startYear, 0, 1).getTime();
        const end = new Date(endYear, 11, 31).getTime();
        const randomTimestamp = start + Math.random() * (end - start);
        const randomDate = new Date(randomTimestamp);

        return randomDate.toISOString().split('T')[0];
    }

    private initialize() {
        for (const neptun of this.validNeptunCodes) {
            this.db[neptun] = [];
            this.counter[neptun] = 0;

            for (let i = 0; i < DEFAULT_CARS_NUM; i++) {
                const car = this.randomCar(neptun);
                car.id = this.counter[neptun]++;
                this.db[neptun].push(car);
            }
        }
    }
}
