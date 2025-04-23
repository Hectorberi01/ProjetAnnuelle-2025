"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json({
                message: "Validation error",
                details: error.details.map((d) => d.message),
            });
            return; // pour ne pas exécuter next()
        }
        next(); // tout est bon, on passe à la suite
    };
};
exports.validateBody = validateBody;
