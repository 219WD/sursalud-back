const mongoose = require("mongoose")

const Schema = mongoose.Schema

const AntecedentesSchema = new Schema({
    afeccionCardiaca: {
        type: Boolean
    },
    alteracionCoagulacion: {
        type: Boolean
    },
    diabetes: {
        type: Boolean
    },
    hipertension: {
        type: Boolean
    },
    epilepsia: {
        type: Boolean
    },
    insufRenal: {
        type: Boolean
    },
    hepatitis: {
        type: Boolean
    },
    insufHepatica: {
        type: Boolean
    },
    alergia: {
        type: Boolean
    },
    asma: {
        type: Boolean
    },
    otros: {
        type: Boolean
    }
})

module.exports = mongoose.model('Antecedentes', AntecedentesSchema)