const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TurnoSchema = new Schema({
    turno: {
        type: Boolean,
        default: true
    },
    paciente: {
        type: Schema.Types.ObjectId,
        ref: "Paciente",
        trim: true,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                const now = new Date();
                return value >= now;
            },
            message: 'La fecha no puede ser en el pasado'
        }
    },
    descripcion: {
        type: String,
        trim: true
    },
    especialista: {  
        type: Schema.Types.ObjectId,
        ref: "Especialista",
        required: true
    }
});

module.exports = mongoose.model('Turno', TurnoSchema);
