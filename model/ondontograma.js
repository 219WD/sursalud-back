const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OdontogramaSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente', // Referencia al modelo de Paciente
        required: true
    },
    teeth: [
        {
            number: {
                type: Number, // Número del diente (1-32)
                required: true
            },
            caries: {
                center: {
                    type: Boolean,
                    default: false
                },
                internal: {
                    type: Boolean,
                    default: false
                },
                external: {
                    type: Boolean,
                    default: false
                },
                left: {
                    type: Boolean,
                    default: false
                },
                right: {
                    type: Boolean,
                    default: false
                }
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Odontograma', OdontogramaSchema);
