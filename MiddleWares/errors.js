exports.generatedErrors = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", "),
            errName: err.name,
        });
    }

    // Handle Mongoose bad ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format.",
            errName: err.name,
        });
    }

    // Handle duplicate key error
    if (err.code && err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`,
            errName: "DuplicateKeyError",
        });
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errName: err.name || "Error",
    });
};