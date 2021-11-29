module.exports = class NotFoundError extends Error {
    constructor(error_code, message) {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
        this.error_code = error_code;
    }

    toDto() {
        return {
            error_code: this.error_code,
            message: this.message
        }
    }
}
