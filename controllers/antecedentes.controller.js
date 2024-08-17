const { validationResult } = require('express-validator');
const Antecedentes = require('../model/antecedentes');

// Crear antecedentes
const createAntecedente = async (req, res) => {
    const {
        afeccionCardiaca,
        alteracionCoagulacion,
        diabetes,
        hipertension,
        epilepsia,
        insufRenal,
        hepatitis,
        insufHepatica,
        alergia,
        asma,
        otros
    } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoAntecedente = new Antecedentes({
            afeccionCardiaca,
            alteracionCoagulacion,
            diabetes,
            hipertension,
            epilepsia,
            insufRenal,
            hepatitis,
            insufHepatica,
            alergia,
            asma,
            otros
        });

        const savedAntecedente = await nuevoAntecedente.save();
        res.json({ message: 'Antecedente creado con éxito', data: savedAntecedente });
    } catch (error) {
        res.status(500).send('Error al crear el antecedente');
    }
};

// Leer todos los antecedentes
const findAllAntecedentes = async (req, res) => {
    try {
        const antecedentes = await Antecedentes.find();
        res.json({ message: 'Buscar todos los antecedentes', data: antecedentes });
    } catch (error) {
        res.status(500).send('Error al buscar antecedentes');
    }
};

// Leer antecedente por ID
const findAntecedenteById = async (req, res) => {
    try {
        const antecedente = await Antecedentes.findById(req.params.id);

        if (!antecedente) {
            return res.status(404).json({ message: 'Antecedente no encontrado' });
        }

        res.json({ message: 'Buscar antecedente por ID', data: antecedente });
    } catch (error) {
        res.status(500).send('Error al buscar el antecedente');
    }
};

// Actualizar antecedente por ID
const updateAntecedenteById = async (req, res) => {
    try {
        const {
            afeccionCardiaca,
            alteracionCoagulacion,
            diabetes,
            hipertension,
            epilepsia,
            insufRenal,
            hepatitis,
            insufHepatica,
            alergia,
            asma,
            otros
        } = req.body;

        const antecedente = await Antecedentes.findById(req.params.id);

        if (!antecedente) {
            return res.status(404).json({ message: 'Antecedente no encontrado' });
        }

        antecedente.afeccionCardiaca = afeccionCardiaca ?? antecedente.afeccionCardiaca;
        antecedente.alteracionCoagulacion = alteracionCoagulacion ?? antecedente.alteracionCoagulacion;
        antecedente.diabetes = diabetes ?? antecedente.diabetes;
        antecedente.hipertension = hipertension ?? antecedente.hipertension;
        antecedente.epilepsia = epilepsia ?? antecedente.epilepsia;
        antecedente.insufRenal = insufRenal ?? antecedente.insufRenal;
        antecedente.hepatitis = hepatitis ?? antecedente.hepatitis;
        antecedente.insufHepatica = insufHepatica ?? antecedente.insufHepatica;
        antecedente.alergia = alergia ?? antecedente.alergia;
        antecedente.asma = asma ?? antecedente.asma;
        antecedente.otros = otros ?? antecedente.otros;

        const updatedAntecedente = await antecedente.save();
        res.json({ message: 'Antecedente actualizado', data: updatedAntecedente });
    } catch (error) {
        res.status(500).send('Error al actualizar el antecedente');
    }
};

// Eliminar antecedente por ID
const deleteAntecedenteById = async (req, res) => {
    try {
        const antecedente = await Antecedentes.findByIdAndDelete(req.params.id);

        if (!antecedente) {
            return res.status(404).json({ message: 'Antecedente no encontrado' });
        }

        res.json({ message: 'Antecedente eliminado', data: antecedente });
    } catch (error) {
        res.status(500).send('Error al eliminar el antecedente');
    }
};

module.exports = {
    createAntecedente,
    findAllAntecedentes,
    findAntecedenteById,
    updateAntecedenteById,
    deleteAntecedenteById
};
