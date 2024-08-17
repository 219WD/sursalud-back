const { Router } = require("express")
const Paciente = require("../model/paciente")
const { createPaciente, findAllPacientes, findPacienteById, updatePacienteById, deletePacienteById, togglePacienteStatus, searchPacientes  } = require("../controllers/paciente.controller")
const { body, param } = require('express-validator');
const { expressValidations } = require('../middlewares/expressValidations');
const verifyJWT = require('../middlewares/verifyJWT');


const pacienteRouter = Router()

//Create
pacienteRouter.post("/createPaciente", [
    body("nombre", "Debe mandar un nombre").notEmpty(),
    body("dni", "Debe mandar un dni").notEmpty(),
    body("domicilio", "Debe mandar un domicilio").notEmpty(),
    body("telefono", "Debe mandar un telefono").notEmpty(),
    body("fechaNacimiento", "Debe mandar una fecha de nacimiento").notEmpty(),
    body("edad", "Debe mandar una edad").notEmpty(),
    body("sexo", "Debe mandar un sexo").notEmpty(),
    body("antecedentes", "Debe mandar un antecedente medico").notEmpty()
],
    verifyJWT,
    expressValidations,
    createPaciente
);

//ReadAll
pacienteRouter.get("/findAllPaciente", findAllPacientes)

//ReadByID
pacienteRouter.get("/findPacienteById/:id", [
    param("id", "Debe mandar un Id valido").isMongoId()
],
    expressValidations,
    findPacienteById
);

// Ruta para búsqueda de pacientes
pacienteRouter.get('/search', searchPacientes);

// Cantidad de pacientes
pacienteRouter.get('/count', async (req, res) => {
    try {
        const count = await Paciente.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la cantidad de pacientes' });
    }
});

// Cantidad pacientes mensual
pacienteRouter.get('/monthly', async (req, res) => {
    try {
        const pacientesMensuales = await Paciente.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.status(200).json(pacientesMensuales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la cantidad de pacientes mensuales' });
    }
});

//Edit
pacienteRouter.put("/updatePacienteById/:id", [
    param("id", "Debe mandar un Id válido").isMongoId(),
    body("nombre", "Debe mandar un nombre").isString(),
    body("dni", "Debe mandar un dni").isString(),
    body("domicilio", "Debe mandar un domicilio").isString(),
    body("telefono", "Debe mandar un telefono").isString(),
    body("fechaNacimiento", "Debe mandar una fecha de nacimiento").isString(),
    body("edad", "Debe mandar una edad").isNumeric(),
    body("sexo", "Debe mandar un sexo").isString(),
    body("antecedentes", "Debe mandar un antecedente medico").isString()
],
    expressValidations,
    updatePacienteById
);

//Delete
pacienteRouter.delete("/deletePacienteById/:id", verifyJWT,  [
    param("id", "Debe mandar un Id valido").isMongoId()
],
    expressValidations,
    deletePacienteById
);

//Baja/Alta
pacienteRouter.patch('/:id/toggle-status', [
    param("id", "Debe mandar un Id válido").isMongoId()
],
    expressValidations,
    togglePacienteStatus
);

module.exports = pacienteRouter;