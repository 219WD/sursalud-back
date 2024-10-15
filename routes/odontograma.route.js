const { Router } = require("express");
const { body, param } = require('express-validator');
const { expressValidations } = require('../middlewares/expressValidations');
const { verifyJWT, verifyRoles } = require('../middlewares/verifyJWT');
// Definir los roles permitidos
const adminAndModerator = verifyRoles('admin', 'moderator');
const adminOnly = verifyRoles('admin');
const {
    createOdontograma,
    findAllOdontogramas,
    findOdontogramaById,
    updateOdontogramaById,
    deleteOdontogramaById
} = require("../controllers/odontograma.controller");

const odontogramaRouter = Router();

// Create
odontogramaRouter.post("/createOdontograma", [
    body("paciente", "Debe mandar un id de paciente válido").isMongoId(),
    body("teeth", "Debe mandar un array de dientes").isArray(),
    body("teeth.*.number", "El número del diente debe ser un número").isNumeric(),
    body("teeth.*.caries", "Las caries deben ser un objeto con booleanos").isObject()
],
    adminAndModerator,
    verifyJWT,
    expressValidations,
    createOdontograma
);

// Read All
odontogramaRouter.get("/findAllOdontogramas", findAllOdontogramas);

// Read By ID
odontogramaRouter.get("/findOdontogramaById/:id", [
    param("id", "Debe mandar un Id válido").isMongoId()
],
    expressValidations,
    findOdontogramaById
);

// Update
odontogramaRouter.put("/updateOdontogramaById/:id", [
    param("id", "Debe mandar un Id válido").isMongoId(),
    body("paciente", "Debe mandar un id de paciente válido").isMongoId(),
    body("teeth", "Debe mandar un array de dientes").isArray(),
    body("teeth.*.number", "El número del diente debe ser un número").isNumeric(),
    body("teeth.*.caries", "Las caries deben ser un objeto con booleanos").isObject()
],
    adminAndModerator,
    expressValidations,
    updateOdontogramaById
);

// Delete
odontogramaRouter.delete("/deleteOdontogramaById/:id", verifyJWT, [
    param("id", "Debe mandar un Id válido").isMongoId()
],
    adminOnly,
    expressValidations,
    deleteOdontogramaById
);

module.exports = odontogramaRouter;