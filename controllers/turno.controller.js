const { validationResult } = require('express-validator');
const Turno = require('../model/turno');
const Paciente = require('../model/paciente');
const Especialista = require('../model/especialista');
const turno = require('../model/turno');

const createTurno = async (req, res) => {
    const { paciente, fecha, descripcion, especialista, precio } = req.body;
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
            paciente: pacienteRecord._id,
            fecha: new Date(fecha), // Almacenar la fecha como Date
            descripcion,
            especialista: especialistaRecord._id,
            precio
        });

        const savedTurno = await newTurno.save();
        res.json({
            message: 'Turno creado con éxito',
            data: savedTurno,
            paciente: pacienteRecord,
            especialista: especialistaRecord,
            precio
        });
    } catch (error) {
        console.error("Error al crear el turno:", error);
        res.status(500).send('Error al crear el turno');
    }
};


const findAllTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find()
        .populate('paciente')
        .populate('especialista');
        res.json({ message: "Buscar todos los turnos", data: turnos });
    } catch (error) {
        res.status(500).send('Error al obtener los turnos');
    }
};

const findTurnoById = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.id)
        .populate('paciente')
        .populate('especialista');

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        res.json({ message: "Buscar turno por Id", data: turno });
    } catch (error) {
        res.status(500).send('Error al obtener el turno');
    }
};

// Controlador para búsqueda de turnos
const searchTurnos = async (req, res) => {
    const { query } = req.query; // Eliminar `activo` de los parámetros

    try {
        if (!query) {
            return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda.' });
        }

        // Buscar pacientes y especialistas que coincidan con el término de búsqueda
        const pacientes = await Paciente.find({ nombre: { $regex: query.toString(), $options: 'i' } });
        const especialistas = await Especialista.find({ nombre: { $regex: query.toString(), $options: 'i' } });

        // Obtener los IDs de pacientes y especialistas
        const pacienteIds = pacientes.map(paciente => paciente._id);
        const especialistaIds = especialistas.map(especialista => especialista._id);

        // Construir el criterio de búsqueda
        const searchCriteria = {
            $or: [
                { paciente: { $in: pacienteIds } },
                { especialista: { $in: especialistaIds } }
            ]
        };

        const turnos = await Turno.find(searchCriteria)
            .populate('paciente')
            .populate('especialista');

        if (turnos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron turnos.' });
        }

        res.json(turnos);
    } catch (error) {
        console.error('Error al buscar los turnos:', error);
        res.status(500).json({ message: 'Error al buscar turnos', error });
    }
};



const updateTurnoById = async (req, res) => {
    try {
        const { paciente, fecha, descripcion, especialista, precio } = req.body;
        const updatedTurno = await Turno.findByIdAndUpdate(
            req.params.id,
            { paciente, fecha, descripcion, especialista, precio },
            { new: true }
        ).populate('paciente')
        .populate('especialista');

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
  
      turno.turno = !turno.turno; // Cambia el estado de turno
      await turno.save();
  
      res.json({ message: `Estado del turno cambiado a: ${turno.turno ? 'true' : 'false'}` });
    } catch (error) {
      console.error('Error al cambiar el estado del turno:', error); // Log detallado del error
      res.status(500).json({ message: 'Error al cambiar el estado del turno', error: error.message });
    }
  };  


const toggleTurnoStatusActivo = async (req, res) => {
    try {
        const turno = await Turno.findById(req.params.id);

        if (!turno) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        turno.activo = !turno.activo; // Cambia el estado de activo a lo false
        await turno.save();

        res.json({ message: `Turno ${turno.activo ? 'activo' : 'inactivo'}` });
    } catch (error) {
        res.status(500).send('Error al cambiar el estado activo del turno');
    }
};

module.exports = {
    createTurno,
    findAllTurnos,
    findTurnoById,
    searchTurnos,
    updateTurnoById,
    deleteTurnoById,
    toggleTurnoStatus,
    toggleTurnoStatusActivo
};