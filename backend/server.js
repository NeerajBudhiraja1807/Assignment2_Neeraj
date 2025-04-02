require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const schema = require('./schema');
const authenticate = require('./middleware/auth');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

app.use(express.json());

// GraphQL Endpoint
app.use('/graphql', (req, res, next) => {
    const user = authenticate(req);
    graphqlHTTP({
        schema,
        graphiql: true,
        context: { user }
    })(req, res, next);
});

// Root
app.get('/', (req, res) => {
    res.send('🚀 Employee Management Backend Running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
