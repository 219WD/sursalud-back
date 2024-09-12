const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const pacienteRouter = require('./routes/paciente.route');
const antecedentesRoutes = require('./routes/antecedentes.route');
const turnoRouter = require('./routes/turno.route');
const odontogramaRouter = require('./routes/odontograma.route');
const especialistaRouter = require('./routes/especialista.route');

require('dotenv').config();
require('./auth/auth');

// mongoose.connect(process.env.MONGO_URI, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const app = express();

// Middleware para analizar JSON
app.use(bodyParser.json());


// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:5173', // Permitir que este origen acceda a tu backend
    credentials: true
}));

// Rutas
app.use('/', routes);
app.use('/pacientes', pacienteRouter);
app.use('/antecedentes', antecedentesRoutes);
app.use('/turnos', turnoRouter);
app.use('/odontograma', odontogramaRouter);
app.use('/especialista', especialistaRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`App listening on ${PORT}`);
});
