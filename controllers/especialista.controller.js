const Especialista = require('../model/especialista');

// Crear un nuevo especialista
const createEspecialista = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del especialista es requerido' });
    }

    try {
        const newEspecialista = new Especialista({ nombre });
        const savedEspecialista = await newEspecialista.save();
        res.status(201).json({ message: 'Especialista creado con éxito', data: savedEspecialista });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el especialista', error });
    }
};

// Obtener todos los especialistas
const getEspecialistas = async (req, res) => {
    try {
        const especialistas = await Especialista.find();
        res.status(200).json(especialistas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los especialistas', error });
    }
};

// Obtener un especialista por ID
const getEspecialistaById = async (req, res) => {
    const { id } = req.params;

    try {
        const especialista = await Especialista.findById(id);
        if (!especialista) {
            return res.status(404).json({ message: 'Especialista no encontrado' });
        }
        res.status(200).json(especialista);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el especialista', error });
    }
};

// Actualizar un especialista por ID
const updateEspecialista = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del especialista es requerido' });
    }

    try {
        const updatedEspecialista = await Especialista.findByIdAndUpdate(id, { nombre }, { new: true });
        if (!updatedEspecialista) {
            return res.status(404).json({ message: 'Especialista no encontrado' });
        }
        res.status(200).json({ message: 'Especialista actualizado con éxito', data: updatedEspecialista });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el especialista', error });
    }
};

// Eliminar un especialista por ID
const deleteEspecialista = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEspecialista = await Especialista.findByIdAndDelete(id);
        if (!deletedEspecialista) {
            return res.status(404).json({ message: 'Especialista no encontrado' });
        }
        res.status(200).json({ message: 'Especialista eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el especialista', error });
    }
};

module.exports = {
    createEspecialista,
    getEspecialistas,
    getEspecialistaById,
    updateEspecialista,
    deleteEspecialista
};
