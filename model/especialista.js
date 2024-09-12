const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EspecialistaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    especialidad: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true  
    }
})

module.exports = mongoose.model('Especialista', EspecialistaSchema);
