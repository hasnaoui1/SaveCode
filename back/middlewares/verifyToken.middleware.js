const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ 'forbidden': "A token is required for authentication" });
    }

    if (req.headers['authorization']) {
        token = token.replace(/^Bearer\s+/, "");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            iat: decoded.iat
        };
        next();
    } catch (err) {
        console.error("JWT error:", err.message); 
        return res.status(401).send({ 'UnAuthorized': "Invalid Token" });
    }
};
