"use strict";

const request = require("supertest");
const assert = require('assert');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const app = require("../src/app")(db);
const buildSchemas = require("../src/schemas");

describe("API tests", () => {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe("GET /health", () => {
        it("should return health", (done) => {
            request(app)
                .get("/health")
                .expect("Content-Type", /text/)
                .expect(200, done);
        });
    });


    describe("GET /rides", () => {
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
                request(app)
                    .get(`/rides?limit=${limit}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(response => {
                        assert.equal(response.body.length, limit);
                        done();
                    });
            });
            it("should return 2 items with 1 offset", (done) => {
                const limit = 2;
                request(app)
                    .get(`/rides?limit=${limit}&offset=1`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(response => {
                        assert.equal(response.body.length, 2);
                        assert.equal(response.body.map(item => item.rideID).indexOf(1), -1);
                        done();
                    });
            });
            it("should return items with 1 offset", (done) => {
                request(app)
                    .get("/rides?offset=1")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(response => {
                        assert.equal(response.body.map(item => item.rideID).indexOf(1), -1);
                        done();
                    });
            });
        });
    });
});
