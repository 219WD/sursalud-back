const { Router } = require("express")
const { createEspecialista, getEspecialistas, getEspecialistaById, updateEspecialista, deleteEspecialista, toggleEspecialistaStatus } = require('../controllers/especialista.controller');
const { body, param } = require('express-validator');
const { expressValidations } = require('../middlewares/expressValidations');
const { verifyJWT, verifyRoles } = require('../middlewares/verifyJWT');
// Definir los roles permitidos
const adminAndModerator = verifyRoles('admin', 'moderator');
const adminOnly = verifyRoles('admin');
const Especialista = require('../model/especialista');


const especialistaRouter = Router()

//Create
especialistaRouter.post("/createEspecialista", [
    verifyJWT,
    adminAndModerator,
    body("nombre", "Debe mandar un nombre").notEmpty(),
    body("especialidad", "Debe mandar un especialista").notEmpty(),
    expressValidations,
    createEspecialista
]);

//ReadAll
especialistaRouter.get("/getEspecialistas", [
    verifyJWT,
    adminAndModerator,
    getEspecialistas
])

//ReadByID
especialistaRouter.get("/getEspecialistaById/:id", [
    verifyJWT,
    adminAndModerator,
    param("id", "Debe mandar un Id valido").isMongoId(),
    expressValidations,
    getEspecialistaById
]);

// Cantidad de especialistas
especialistaRouter.get('/count', async (req, res) => {
    try {
        const count = await Especialista.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la cantidad de especialistas' });
    }
});


//Edit
especialistaRouter.put("/updateEspecialista/:id", [
    verifyJWT,
    adminAndModerator,
    param("id", "Debe mandar un Id válido").isMongoId(),
    body("nombre", "Debe mandar un nombre").isString(),
    body("especialidad", "Debe mandar una especialidad").isString(),
    expressValidations,
    updateEspecialista
]);

//Delete
especialistaRouter.delete("/deleteEspecialista/:id", verifyJWT, [
    verifyJWT,
    adminOnly,
    param("id", "Debe mandar un Id valido").isMongoId(),
    adminOnly,
    expressValidations,
    deleteEspecialista
]);


//Baja/Alta
especialistaRouter.patch('/:id/toggle-status', [
    verifyJWT,
    adminAndModerator,
    param("id", "Debe mandar un Id válido").isMongoId(),
    expressValidations,
    toggleEspecialistaStatus
]);

module.exports = especialistaRouter;