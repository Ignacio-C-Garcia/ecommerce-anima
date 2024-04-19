//Middleware para extraer el ID del usuario de la solicitud JWT
const extractUserId = (req, res, next) => {
  req.userId = req.auth.sub
  next();
};
module.exports = extractUserId;
