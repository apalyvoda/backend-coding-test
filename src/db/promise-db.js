// I could install the promised-sqlite3 module, but not sure if this is allowed in this assignment

module.exports = (db) => {
    db.createPromise = (sql, values) => {
        return new Promise((resolve, reject) => {
            db.run(sql, values, function (error) {
                if (error) {
                    reject(error);
                }
                resolve(this);
            });
        });
    };

    db.allPromise = (sql, values) => {
        return new Promise((resolve, reject) => {
            db.all(sql, values, function (error, rows) {
                if (error) {
                    reject(error);
                }
                resolve(rows);
            });
        });
    };

    return db;
};
