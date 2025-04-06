require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const schema = require('./schema');
const authenticate = require('./middleware/auth');

const app = express();

// ✅ Middleware order is important
app.use(cors({
    origin: [
      'http://localhost:4200',
      'https://assignment2-2jkbk3t0m-neerajbudhiraja1807s-projects.vercel.app'
    ],
    credentials: true
  }));

app.use(express.json()); // ✅ correctly applied once globally

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// ✅ GraphQL Route — no second express.json() here
app.use('/graphql', (req, res) => {
    console.log('🧪 Incoming GraphQL request body:', req.body); // 👈 ADD THIS LINE
    const user = authenticate(req);
    graphqlHTTP({
        schema,
        graphiql: true,
        context: { user }
    })(req, res);
});


// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error('🔥 Server error:', err.stack);
    res.status(500).send('Something broke!');
});

// Health Check Route
app.get('/', (req, res) => {
    res.send('🚀 Employee Management Backend Running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
