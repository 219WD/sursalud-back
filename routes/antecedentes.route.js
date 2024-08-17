const { Router } = require('express');
const { body, param } = require('express-validator');
const { expressValidations } = require('../middlewares/expressValidations');
const { createAntecedente, findAllAntecedentes, findAntecedenteById, updateAntecedenteById, deleteAntecedenteById } = require('../controllers/antecedentes.controller');
const router = Router();

// Validaciones para los antecedentes
const validateAntecedentes = [
    body('afeccionCardiaca').isBoolean().optional(),
    body('alteracionCoagulacion').isBoolean().optional(),
    body('diabetes').isBoolean().optional(),
    body('hipertension').isBoolean().optional(),
    body('epilepsia').isBoolean().optional(),
    body('insufRenal').isBoolean().optional(),
    body('hepatitis').isBoolean().optional(),
    body('insufHepatica').isBoolean().optional(),
    body('alergia').isBoolean().optional(),
    body('asma').isBoolean().optional(),
    body('otros').isBoolean().optional()
];

// Crear antecedente
router.post('/createAntecedente', validateAntecedentes, expressValidations, createAntecedente);

// Leer todos los antecedentes
router.get('/findAllAntecedentes', findAllAntecedentes);

// Leer antecedente por ID
router.get('/findAntecedenteById/:id', [
    param('id', 'ID debe ser un ID válido').isMongoId()
], expressValidations, findAntecedenteById);

// Actualizar antecedente por ID
router.put('/updateAntecedenteById/:id', [
    param('id', 'ID debe ser un ID válido').isMongoId(),
    ...validateAntecedentes
], expressValidations, updateAntecedenteById);

// Eliminar antecedente por ID
router.delete('/deleteAntecedenteById/:id', [
    param('id', 'ID debe ser un ID válido').isMongoId()
], expressValidations, deleteAntecedenteById);

module.exports = router;
