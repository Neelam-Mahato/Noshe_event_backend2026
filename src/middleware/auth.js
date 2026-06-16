const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success:false,
            code: 'TOKEN_MISSING',
            message:'Token Missing'
        });
    }

    // const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(authHeader,process.env.JWT_SECRET);
        // req.memberId = decoded.memberId;
        next();
    } catch(err){

          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                code: 'TOKEN_EXPIRED',
                message: 'Token Expired'
            });
        }
        return res.status(401).json({
            success:false,
            code: 'INVALID_TOKEN',
            message:'Invalid Token'
        });

    }
};

module.exports = {verifyToken};