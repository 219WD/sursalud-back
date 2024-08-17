const { validationResult } = require("express-validator");

const expressValidations = (req, res, next) => {
   const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400);
        return res.send({ errors: result.array() });
    }
    next();
}

module.exports = {
    expressValidations
}
