const { Router } = require("express")
const { createEspecialista, getEspecialistas, getEspecialistaById, updateEspecialista, deleteEspecialista } = require('../controllers/especialista.controller');
const { body, param } = require('express-validator');
const { expressValidations } = require('../middlewares/expressValidations');
const verifyJWT = require('../middlewares/verifyJWT');


const especialistaRouter = Router()

//Create
especialistaRouter.post("/createEspecialista", [
    body("nombre", "Debe mandar un nombre").notEmpty()
],
    verifyJWT,
    expressValidations,
    createEspecialista
);

//ReadAll
especialistaRouter.get("/getEspecialistas", getEspecialistas)

//ReadByID
especialistaRouter.get("/getEspecialistaById/:id", [
    param("id", "Debe mandar un Id valido").isMongoId()
],
    expressValidations,
    getEspecialistaById
);

//Edit
especialistaRouter.put("/updateEspecialista/:id", [
    param("id", "Debe mandar un Id válido").isMongoId(),
    body("nombre", "Debe mandar un nombre").isString()
],
    expressValidations,
    updateEspecialista
);

//Delete
especialistaRouter.delete("/deleteEspecialista/:id", verifyJWT,  [
    param("id", "Debe mandar un Id valido").isMongoId()
],
    expressValidations,
    deleteEspecialista
);

module.exports = especialistaRouter;