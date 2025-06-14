const adminAccess = (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
        return res.status(401).json({ success: false, message: "Unauthorized For this" });
    }

    if (role === "staff" || role === "doctor") {
        return next();
    }

    return res.status(403).json({ success: false, message: "Access denied: Patients are not allowed to access dashboard" });
};

module.exports = adminAccess;
