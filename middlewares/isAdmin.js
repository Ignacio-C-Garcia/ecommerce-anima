function isAdmin(req, res, next) {
  if (req.auth.role === "Admin") {
    return next();
  }
  res.status(401).send("Access denied. Only admins authorized.");
}

module.exports = isAdmin;
