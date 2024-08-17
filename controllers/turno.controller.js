const { validationResult } = require('express-validator');
const Turno = require('../model/turno');
const Paciente = require('../model/paciente');
const Especialista = require('../model/especialista');

const createTurno = async (req, res) => {
    const { turno, paciente, fecha, descripcion, especialista } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Verificar que el paciente existe
        const pacienteRecord = await Paciente.findById(paciente);
        if (!pacienteRecord) {
            return res.status(400).json({ message: 'El paciente especificado no existe' });
        }

        // Verificar que el especialista existe
        const especialistaRecord = await Especialista.findById(especialista);
        if (!especialistaRecord) {
            return res.status(400).json({ message: 'El especialista especificado no existe' });
        }

        // Crear el nuevo turno
        const newTurno = new Turno({
            turno,
            paciente: pacienteRecord._id,
            fecha: new Date(fecha), // Almacenar la fecha como Date
            descripcion,
            especialista: especialistaRecord._id
        });

        const savedTurno = await newTurno.save();
        res.json({
            message: 'Turno creado con éxito',
            data: savedTurno,
            paciente: pacienteRecord,
            especialista: especialistaRecord
        });
    } catch (error) {
        console.error("Error al crear el turno:", error);
        res.status(500).send('Error al crear el turno');
    }
};


const findAllTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find().populate('paciente');
        res.json({ message: "Buscar todos los turnos", data: turnos });
    } catch (error) {
        res.status(500).send('Error al obtener los turnos');
    }
};

const findTurnoById = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.id).populate('paciente');

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        res.json({ message: "Buscar turno por Id", data: turno });
    } catch (error) {
        res.status(500).send('Error al obtener el turno');
    }
};

const updateTurnoById = async (req, res) => {
    try {
        const { turno, paciente, fecha, descripcion } = req.body;
        const updatedTurno = await Turno.findByIdAndUpdate(
            req.params.id,
            { turno, paciente, fecha, descripcion },
            { new: true }
        ).populate('paciente');

        if (!updatedTurno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        res.json({ message: "Turno actualizado", data: updatedTurno });
    } catch (error) {
        res.status(500).send('Error al actualizar el turno');
    }
};

const deleteTurnoById = async (req, res) => {
    try {
        const deletedTurno = await Turno.findByIdAndDelete(req.params.id);

        if (!deletedTurno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        res.json({ message: "Turno eliminado" });
    } catch (error) {
        res.status(500).send('Error al eliminar el turno');
    }
};

const toggleTurnoStatus = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.id);

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        turno.turno = !turno.turno; // Cambia el estado de turno a lo opuesto
        await turno.save();

        res.json({ message: `Turno ${turno.turno ? 'activado' : 'desactivado'}` });
    } catch (error) {
        res.status(500).send('Error al cambiar el estado del turno');
    }
};

module.exports = {
    createTurno,
    findAllTurnos,
    findTurnoById,
    updateTurnoById,
    deleteTurnoById,
    toggleTurnoStatus
};
