const jwt = require('jsonwebtoken');

const authenticate = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (err) {
            console.log("❌ Invalid or Expired Token");
        }
    }
    return null;
};

module.exports = authenticate;
