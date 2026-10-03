/**
 * ============================================
 * Role Authorization Middleware
 * ============================================
 */

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // Check if the authenticated user has an allowed role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission."
            });
        }

        // User has the required role
        next();
    };
};

module.exports = authorizeRoles;