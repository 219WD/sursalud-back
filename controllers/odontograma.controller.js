const { validationResult } = require('express-validator');
const Odontograma = require("../model/ondontograma");
const Paciente = require("../model/paciente");

const createOdontograma = async (req, res) => {
    const { paciente, teeth } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Verificar que el paciente existe
        const pacienteRecord = await Paciente.findById(paciente);
        if (!pacienteRecord) {
            return res.status(400).json({ message: 'Paciente no encontrado' });
        }

        // Crear el nuevo odontograma
        const newOdontograma = new Odontograma({
            paciente,
            teeth
        });

        const savedOdontograma = await newOdontograma.save();

        res.json({ 
            message: 'Odontograma creado con éxito', 
            data: savedOdontograma 
        });
    } catch (error) {
        res.status(500).send('Error al crear el odontograma');
    }
};

const findAllOdontogramas = async (req, res) => {
    const odontogramas = await Odontograma.find().populate('paciente');
    res.json({ message: "Buscar todos los odontogramas", data: odontogramas });
};

const findOdontogramaById = async (req, res) => {
    const odontograma = await Odontograma.findById(req.params.id).populate('paciente');

    if (odontograma === null) {
        res.status(404);
        return res.json({ message: "Odontograma no encontrado" });
    }

    res.json({ message: "Buscar odontograma por Id", data: odontograma });
};

const updateOdontogramaById = async (req, res) => {
    const odontograma = await Odontograma.findById(req.params.id);

    if (odontograma === null) {
        res.status(404);
        return res.json({ message: "Odontograma no encontrado" });
    }

    await Odontograma.findByIdAndUpdate(req.params.id, {
        paciente: req.body.paciente,
        teeth: req.body.teeth
    });

    res.json({ message: "Odontograma actualizado" });
};

const deleteOdontogramaById = async (req, res) => {
    const deletedDocuments = await Odontograma.deleteOne({ _id: req.params.id });

    if (deletedDocuments.deletedCount === 0) {
        res.status(404);
        return res.json({ message: "Odontograma no encontrado" });
    }

    res.json({ message: "Odontograma eliminado" });
};

module.exports = {
    createOdontograma,
    findAllOdontogramas,
    findOdontogramaById,
    updateOdontogramaById,
    deleteOdontogramaById
};
