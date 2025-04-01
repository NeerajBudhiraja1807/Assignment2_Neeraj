require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const schema = require('./schema'); 

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// CORS configuration for Angular frontend
app.use(cors({
    origin: 'http://localhost:4200', // Allow only the Angular frontend to access
    credentials: true,               // Allow credentials (cookies, headers, etc.)
}));


// Middleware to parse JSON
app.use(express.json());

// Authentication Middleware (Only for Protected Routes)
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; 
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
    }
    next(); 
};

// GraphQL Endpoint
app.use('/graphql', (req, res, next) => {
    let user = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1]; 
        try {
            user = jwt.verify(token, process.env.JWT_SECRET); 
        } catch (err) {
            console.log("❌ Invalid or Expired Token");
        }
    }

    graphqlHTTP({
        schema,
        graphiql: true,
        context: { user } 
    })(req, res, next);
});

// Root Route
app.get('/', (req, res) => {
    res.send('🚀 Employee Management System Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
