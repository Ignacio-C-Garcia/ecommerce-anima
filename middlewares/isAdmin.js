//Middleware para comparar que el usuario sea un admin.

function isAdmin(req, res, next) {
  if (req.auth.role === "Admin") {
    return next();
  }
  res.status(401).json({ errors: ["Access denied. Only admins authorized."] });
}

module.exports = isAdmin;
