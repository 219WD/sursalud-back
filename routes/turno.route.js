const { Router } = require("express");
const Turno = require("../model/turno");
const { createTurno, findAllTurnos, findTurnoById, updateTurnoById, deleteTurnoById, toggleTurnoStatus, searchTurnos, toggleTurnoStatusActivo } = require("../controllers/turno.controller");
const { body, param } = require('express-validator');
const { expressValidations } = require('../middlewares/expressValidations');
const verifyJWT = require('../middlewares/verifyJWT');

const turnoRouter = Router();

// Crear
turnoRouter.post("/createTurno", [
    body("paciente", "Debe enviar un Id de paciente válido").isMongoId(),
    body("fecha", "Debe mandar una fecha válida").notEmpty().isISO8601().toDate(),
    body("descripcion", "Debe mandar una descripción").optional().isString(),
    body("especialista", "Debe enviar un Id de especialista válido").isMongoId()
],
    verifyJWT,
    expressValidations,
    createTurno
);

// Leer todos
turnoRouter.get("/findAllTurnos", findAllTurnos);

// Leer por ID
turnoRouter.get("/findATurnoById/:id", [
    param("id", "Debe enviar un Id válido").isMongoId()
],
    expressValidations,
    findTurnoById
);


// Ruta para búsqueda de pacientes
turnoRouter.get('/search', searchTurnos);

// Cantidad de turnos del dia
turnoRouter.get('/today', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const turnosHoy = await Turno.countDocuments({
            fecha: { $gte: startOfDay, $lte: endOfDay }
        });

        res.status(200).json({ turnosHoy });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la cantidad de turnos de hoy' });
    }
});

// Total turnos mensuales
turnoRouter.get('/monthly', async (req, res) => {
    try {
        const turnosMensuales = await Turno.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$fecha" }, year: { $year: "$fecha" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        res.status(200).json(turnosMensuales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la cantidad de turnos mensuales' });
    }
});


// Actualizar
turnoRouter.put("/updateTurnoById/:id", [
    param("id", "Debe enviar un Id válido").isMongoId(),
    body("turno", "Debe enviar un estado de turno (true o false)").isBoolean(),
    body("paciente", "Debe enviar un Id de paciente válido").isMongoId()
],
    expressValidations,
    updateTurnoById
);

// Eliminar
turnoRouter.delete("/deleteTurnoById/:id", verifyJWT, [
    param("id", "Debe enviar un Id válido").isMongoId()
],
    expressValidations,
    deleteTurnoById
);

// Toggle estado
turnoRouter.patch('/:id/toggle-status', [
    param("id", "Debe enviar un Id válido").isMongoId()
],
    expressValidations,
    toggleTurnoStatus
);

// Toggle estado turno activo/inactivo (delete)
turnoRouter.patch('/:id/toggle-status-activo', [
    param("id", "Debe enviar un Id válido").isMongoId()
],
    expressValidations,
    toggleTurnoStatusActivo
);

module.exports = turnoRouter;