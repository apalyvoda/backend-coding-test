"use strict";

const assert = require("assert");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");
const promiseDb = require("../src/db/promise-db")(db);
const Service = require("../src/service");
const service = new Service(promiseDb);
const buildSchemas = require("../src/schemas");
const ValidationError = require("../src/errors/validation.error");
const NotFoundError = require("../src/errors/not-found.error");

describe("Service tests", () => {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe("Service create", () => {
        it("should create item", (done) => {
            service.create({
                "start_lat": 40,
                "start_long": 50,
                "end_lat": 50,
                "end_long": 50,
                "rider_name": "Ride Name",
                "driver_name": "Driver name",
                "driver_vehicle": "Driver vehicle"
            }).then(rows => {
                assert.equal(rows.length, 1);
                assert.equal(rows.map(item => item.rideID).indexOf(1), 0);
                done();
            });
        });
        describe("Service create errors", () => {
            it("should be a start_lat validation error", (done) => {
                service.create({
                    "start_lat": 100,
                    "start_long": 50,
                    "end_lat": 50,
                    "end_long": 50,
                    "rider_name": "Ride Name",
                    "driver_name": "Driver name",
                    "driver_vehicle": "Driver vehicle"
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
            it("should be a start_long validation error", (done) => {
                service.create({
                    "start_lat": 50,
                    "start_long": 190,
                    "end_lat": 50,
                    "end_long": 50,
                    "rider_name": "Ride Name",
                    "driver_name": "Driver name",
                    "driver_vehicle": "Driver vehicle"
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
            it("should be a end_lat validation error", (done) => {
                service.create({
                    "start_lat": 50,
                    "start_long": 50,
                    "end_lat": 100,
                    "end_long": 50,
                    "rider_name": "Ride Name",
                    "driver_name": "Driver name",
                    "driver_vehicle": "Driver vehicle"
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
            it("should be a end_long validation error", (done) => {
                service.create({
                    "start_lat": 50,
                    "start_long": 50,
                    "end_lat": 50,
                    "end_long": 190,
                    "rider_name": "Ride Name",
                    "driver_name": "Driver name",
                    "driver_vehicle": "Driver vehicle"
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
            it("should be a rider_name validation error", (done) => {
                service.create({
                    "start_lat": 50,
                    "start_long": 50,
                    "end_lat": 50,
                    "end_long": 50,
                    "rider_name": "",
                    "driver_name": "Driver name",
                    "driver_vehicle": "Driver vehicle"
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
            it("should be a driver_name validation error", (done) => {
                service.create({
                    "start_lat": 50,
                    "start_long": 50,
                    "end_lat": 50,
                    "end_long": 50,
                    "rider_name": "Ride Name",
                    "driver_name": "",
                    "driver_vehicle": "Driver vehicle"
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
            it("should be a driver_vehicle validation error", (done) => {
                service.create({
                    "start_lat": 50,
                    "start_long": 50,
                    "end_lat": 50,
                    "end_long": 50,
                    "rider_name": "Ride Name",
                    "driver_name": "Driver name",
                    "driver_vehicle": ""
                }).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof ValidationError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
        });
    });

    describe("Service getMany", () => {
        describe("not found error", () => {
            before((done) => {
                db.run("DELETE FROM Rides", done);
            });
            it("should be a not found error", (done) => {
                service.getMany().then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof NotFoundError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
        });
        describe("pagination", () => {
            before((done) => {
                const item =
                    {
                        "startLat": 60,
                        "startLong": 50,
                        "endLat": 50,
                        "endLong": 50,
                        "riderName": "Ride Name",
                        "driverName": "Driver name",
                        "driverVehicle": "Driver vehicle",
                    };
                const values = Object.values(item);

                Promise.all(
                    Array(3).fill(values).map((values) => db.run("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values))).then(() => {
                    done();
                });
            });
            it("should return 2 items", (done) => {
                const limit = 2;
                service.getMany(2, 0).then(rows => {
                    assert.equal(rows.length, limit);
                    done();
                });
            });
            it("should return 2 items with 1 offset", (done) => {
                const limit = 2;
                service.getMany(2, 1).then(rows => {
                    assert.equal(rows.length, limit);
                    assert.equal(rows.map(item => item.rideID).indexOf(1), -1);
                    done();
                });
            });
            it("should return items with 1 offset", (done) => {
                service.getMany(undefined, 1).then(rows => {
                    assert.equal(rows.map(item => item.rideID).indexOf(1), -1);
                    done();
                });
            });
        });
    });

    describe("Service getOne", () => {
        describe("not found error", () => {
            before((done) => {
                db.run("DELETE FROM Rides", done);
            });
            it("should be a not found error", (done) => {
                service.getOne(1).then(() => {
                    throw new Error("Missing rejection");
                }).catch(e => {
                    if (e instanceof NotFoundError) {
                        return done();
                    }
                    throw new Error("Missing rejection");
                });
            });
        });
        describe("get ride by id", () => {
            let rideID = 0;
            before((done) => {
                const item =
                    {
                        "startLat": 60,
                        "startLong": 50,
                        "endLat": 50,
                        "endLong": 50,
                        "riderName": "Ride Name",
                        "driverName": "Driver name",
                        "driverVehicle": "Driver vehicle",
                    };
                const values = Object.values(item);
                db.run("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values, function () {
                    rideID = this.lastID;
                    done();
                })
            });

            it("should return item by id", (done) => {
                service.getOne(Number(rideID)).then(rows => {
                    assert.equal(rows.length, 1);
                    assert.equal(rows.map(item => item.rideID).indexOf(rideID), 0);
                    done();
                });
            });
        });
    });
});
