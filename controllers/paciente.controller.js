const { validationResult } = require('express-validator');
const Paciente = require("../model/paciente");
const Antecedentes = require("../model/antecedentes");

const createPaciente = async (req, res) => {
    const { nombre, dni, domicilio, telefono, fechaNacimiento, edad, sexo, antecedentes, medicamentos } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Verificar que los antecedentes existen (opcional)
        const antecedentesRecord = await Antecedentes.findById(antecedentes);
        if (!antecedentesRecord) {
            return res.status(400).json({ message: 'Los antecedentes especificados no existen' });
        }

        // Crear el nuevo paciente
        const newPaciente = new Paciente({
            nombre,
            dni,
            domicilio,
            telefono,
            fechaNacimiento,
            edad,
            sexo,
            antecedentes: antecedentesRecord._id,
            medicamentos
        });

        const savedPaciente = await newPaciente.save();

        res.json({ 
            message: 'Paciente creado con éxito', 
            data: savedPaciente, 
            antecedentes: antecedentesRecord 
        });
    } catch (error) {
        res.status(500).send('Error al crear al paciente');
    }
};



const findAllPacientes = async (req, res) => {
    const nombreRegex = new RegExp(req.query.nombre, 'i');
    const dniRegex = new RegExp(req.query.dni, 'i');
    const pacientes = await Paciente.find({ nombre: { $regex: nombreRegex }, dni: { $regex: dniRegex } })

    res.json({ message: "Buscar todos los pacientes", data: pacientes })
}

const findPacienteById = async (req, res) => {
    try {
        // Buscar el paciente por ID y popular los antecedentes
        const paciente = await Paciente.findById(req.params.id).populate('antecedentes');

        if (!paciente) {
            res.status(404);
            return res.json({ message: "Paciente no encontrado" });
        }

        res.json({ message: "Buscar paciente por Id", data: paciente });
    } catch (error) {
        console.error('Error al buscar el paciente:', error);
        res.status(500).json({ message: 'Error al buscar el paciente', error });
    }
};


// Controlador para búsqueda de pacientes
const searchPacientes = async (req, res) => {
    const { query, activo } = req.query;

    try {
        if (!query) {
            return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda.' });
        }

        const searchCriteria = {
            $or: [
                { nombre: { $regex: query.toString(), $options: 'i' } },
                { dni: { $regex: query.toString(), $options: 'i' } }
            ]
        };

        if (activo) {
            searchCriteria.activo = activo === 'true';
        }

        const pacientes = await Paciente.find(searchCriteria);

        if (!pacientes.length) {
            return res.status(404).json({ message: 'No se encontraron pacientes.' });
        }

        res.json(pacientes);
    } catch (error) {
        console.error('Error al buscar pacientes:', error);
        res.status(500).json({ message: 'Error al buscar pacientes', error });
    }
};




const updatePacienteById = async (req, res) => {
    const paciente = await Paciente.findById(req.params.id);

    if (paciente === null) {
        res.status(404)
        return res.json({ message: "Paciente no encontrado" })
    }

    await Paciente.findByIdAndUpdate(req.params.id, {
        nombre: req.body.nombre,
        dni: req.body.dni,
        domicilio: req.body.domicilio,
        telefono: req.body.telefono,
        fechaNacimiento: req.body.fechaNacimiento,
        edad: req.body.edad,
        sexo: req.body.sexo,
        antecedentes: req.body.antecedentes,
        medicamentos: req.body.medicamentos
    })


    res.json({ message: "Paciente actualizado" })
}

const deletePacienteById = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo un administrador puede eliminar pacientes.' });
    }

    const filters = { _id: req.params.id };
    const deletedDocuments = await Paciente.deleteOne(filters);

    if (deletedDocuments.deletedCount === 0) {
        res.status(404);
        return res.json({ message: "Paciente no encontrado" });
    }

    res.json({ message: "Paciente eliminado" });
}

const togglePacienteStatus = async (req, res) => {
    const paciente = await Paciente.findById(req.params.id);

    if (paciente === null) {
        res.status(404);
        return res.json({ message: "Paciente no encontrado" });
    }

    paciente.activo = !paciente.activo; // Cambia el estado de activo a lo opuesto
    await paciente.save();

    res.json({ message: `Paciente ${paciente.activo ? 'activado' : 'desactivado'}` });
};

module.exports = {
    createPaciente,
    findAllPacientes,
    findPacienteById,
    updatePacienteById,
    deletePacienteById,
    togglePacienteStatus,
    searchPacientes
}