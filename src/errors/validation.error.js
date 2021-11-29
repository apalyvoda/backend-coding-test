module.exports = class ValidationError extends Error {
    constructor(error_code, message) {
        super(message);
        this.name = "ValidationError";
        this.status = 400;
        this.error_code = error_code;
    }

    toDto() {
        return {
            error_code: this.error_code,
            message: this.message
        }
    }
}
