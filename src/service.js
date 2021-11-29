const ValidationError = require("./errors/validation.error");
const NotFoundError = require("./errors/not-found.error");
const ServerError = require("./errors/server.error");
module.exports = class Service {
    constructor(db) {
        this.db = db;
    }

    async create(body) {
        const startLatitude = Number(body.start_lat);
        const startLongitude = Number(body.start_long);
        const endLatitude = Number(body.end_lat);
        const endLongitude = Number(body.end_long);
        const riderName = body.rider_name;
        const driverName = body.driver_name;
        const driverVehicle = body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            throw new ValidationError("VALIDATION_ERROR", "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively.");
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            throw new ValidationError("VALIDATION_ERROR", "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively.");
        }

        if (typeof riderName !== "string" || riderName.length < 1) {
            throw new ValidationError("VALIDATION_ERROR", "Rider name must be a non empty string.");
        }

        if (typeof driverName !== "string" || driverName.length < 1) {
            throw new ValidationError("VALIDATION_ERROR", "Driver name must be a non empty string.");
        }

        if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
            throw new ValidationError("VALIDATION_ERROR", "Driver vehicle must be a non empty string.");
        }

        const values = [startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle];

        try {
            const res = await this.db.createPromise("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values);
            return this.db.allPromise(`SELECT * FROM Rides WHERE rideID = ${res.lastID}`);
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err;
            }
            throw new ServerError("SERVER_ERROR", "Unknown error");
        }
    }

    async getMany(limit = 10, offset = 0) {
        if (limit && Number.isNaN(limit)) {
            throw new ValidationError("VALIDATION_ERROR", "Limit must be a positive integer.");
        }
        if (offset && Number.isNaN(offset)) {
            throw new ValidationError("VALIDATION_ERROR", "Offset must be a positive integer.");
        }

        try {
            const rows = await this.db.allPromise("SELECT * FROM Rides LIMIT ?, ?", [offset, limit]);
            if (rows.length === 0) {
                throw new NotFoundError(
                    "RIDES_NOT_FOUND_ERROR",
                    "Could not find any rides"
                );
            }
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err;
            }
            throw new ServerError("SERVER_ERROR", "Unknown error");
        }
    }

    async getOne(id) {
        if (!id || Number.isNaN(id)) {
            throw new ValidationError("VALIDATION_ERROR", "Id must be a positive integer.");
        }
        try {
            const rows = await this.db.allPromise("SELECT * FROM Rides WHERE rideID = ?", [id]);
            if (rows.length === 0) {
                throw new NotFoundError(
                    "RIDES_NOT_FOUND_ERROR",
                    "Could not find any rides"
                );
            }
            return rows;
        } catch (err) {
            if (err instanceof NotFoundError) {
                throw err;
            }
            throw new ServerError("SERVER_ERROR", "Unknown error");
        }
    }
};
