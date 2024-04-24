module.exports = function jwtErrorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ errors: ["Cannot authenticate API key"] });
  } else {
    next(err);
  }
};
