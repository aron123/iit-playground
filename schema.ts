export interface Car {
    id: number;
    brand: 'Toyota'|'Honda'|'Ford'|'Chevrolet'|'Nissan'|'BMW'|'Mercedes-Benz'|'Volkswagen'|'Audi'|'Hyundai'|'Kia'|'Subaru'|'Lexus'|'Mazda'|'Tesla'|'Jeep'|'Porsche'|'Volvo'|'Jaguar'|'Land Rover'|'Mitsubishi'|'Ferrari'|'Lamborghini';
    model: string; // not empty
    fuelUse: number; // greater than zero if electric is false, otherwise 0
    owner: string; // not empty, contains at least 1 space
    dayOfCommission: string; // not empty, date format like 2020-01-01
    electric: boolean; 
}

export type TaxiCompanyDatabase = {
    [neptun: string]: Car[]; // The object has Neptun code keys, each mapping to an array of Car objects
};

function isValidDate(dateString: string): boolean {
    // Format: YYYY-MM-DD
    const regex = /^(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
    
    if (!regex.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // Check if the constructed date is valid (it will be invalid if the date is out of range)
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export function sanitizeCar(car: any): Car {
    if (Object.prototype.toString.call(car) !== '[object Object]' || car === null) {
        throw 'Request body is invalid. A Car object must be given.';
    }

    const id = car.id;

    if (!car.brand) {
        throw 'Car brand should be defined.';
    }

    const validBrands: Car['brand'][] = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
        'Volkswagen', 'Audi', 'Hyundai', 'Kia', 'Subaru', 'Lexus', 'Mazda', 'Tesla',
        'Jeep', 'Porsche', 'Volvo', 'Jaguar', 'Land Rover', 'Mitsubishi', 'Ferrari', 'Lamborghini'];
    
    if (!validBrands.includes(car.brand)) {
        throw `Car brand is invalid: ${car.brand}`;
    }

    const brand = car.brand;

    if (!car.model) {
        throw 'Car model should be defined.';
    }

    const model = String(car.model);

    if (typeof car.electric !== 'boolean') {
        throw 'Electric property should be a Boolean.';
    }

    const electric = !!car.electric;

    const fuelUse = parseFloat(car.fuelUse)

    if (isNaN(fuelUse)) {
        throw 'Fuel use should be given as a floating-point number.';
    }

    if (electric && fuelUse != 0) {
        throw 'Fuel consumption should be 0 for electric cars.';
    }

    if (!electric && fuelUse <= 0) {
        throw 'Fuel consumption should be greater than 0.';
    }

    if (typeof car.owner !== 'string' || car.owner.length < 3 || !car.owner.includes(' ')) {
        throw 'Owner should have valid first and lastnames.';
    }

    const owner = car.owner;

    if (typeof car.dayOfCommission !== 'string' || !isValidDate(car.dayOfCommission)) {
        throw `The given date is invalid: ${car.dayOfCommission}`;
    }

    const dayOfCommission = car.dayOfCommission;

    return { id, brand, model, fuelUse, owner, dayOfCommission, electric };
}