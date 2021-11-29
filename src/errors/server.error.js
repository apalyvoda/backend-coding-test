module.exports = class ServerError extends Error {
    constructor(error_code, message) {
        super(message);
        this.name = "ServerError";
        this.status = 500;
        this.error_code = error_code;
    }

    toDto() {
        return {
            error_code: this.error_code,
            message: this.message
        }
    }
}
