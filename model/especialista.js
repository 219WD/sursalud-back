const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EspecialistaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Especialista', EspecialistaSchema);
