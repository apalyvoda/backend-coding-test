"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const winston = require("winston");
const Service = require("./service");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {service: "user-service"},
    transports: [
        new winston.transports.File({filename: "error.log", level: "error"}),
        new winston.transports.File({filename: "combined.log"}),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = (db) => {
    const service = new Service(db);

    app.get("/health", (req, res) => res.send("Healthy"));

    app.post("/rides", jsonParser, async (req, res) => {
        try {
            const result = await service.create(req.body);
            res.send(result);
        } catch (error) {
            logger.error(`[${error.error_code}]: ${error.message}`);
            res.status(error.status);
            res.send(error.toDto());
        }
    });

    app.get("/rides", async (req, res) => {
        try {
            const result = await service.getMany(req.query.limit, req.query.offset);
            res.send(result);
        } catch (error) {
            logger.error(`[${error.error_code}]: ${error.message}`);
            res.status(error.status);
            res.send(error.toDto());
        }
    });

    app.get("/rides/:id", async (req, res) => {
        try {
            const result = await service.getOne(Number(req.params.id));
            res.send(result);
        } catch (error) {
            logger.error(`[${error.error_code}]: ${error.message}`);
            res.status(error.status);
            res.send(error.toDto());
        }
    });
    return app;
};
