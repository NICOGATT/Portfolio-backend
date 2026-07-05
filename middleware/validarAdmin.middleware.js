const validarAdmin = (req, res, next) => {
    try {
        if(!req.usuario) {
            return res.status(401).json({message: 'Usuario no autenticado'});
        }
        if(req.usuario.role !== 'admin') {
            return res.status(403).json({message: 'Acceso denegado, se requiere rol de admin'});
        }
        next();
    } catch (error) {
        return res.status(500).json({message: 'Error interno del servidor'});
    }
}

module.exports = validarAdmin;