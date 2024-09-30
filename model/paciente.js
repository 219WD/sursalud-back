const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
    },
    domicilio: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    antecedentes: {
        type: Schema.Types.ObjectId,
        ref: "Antecedentes",
        required: true
    },
    activo: {
        type: Boolean,
        default: true  
    },
    medicamentos: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Paciente', PacienteSchema);
