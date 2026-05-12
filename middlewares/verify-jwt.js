import jwt from 'jsonwebtoken'

export const validateJWT = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization']

    if (!token) {
        return res.status(401).json({ msg: 'Es necesario un token para comprobar su autorización' })
    }

    try {
        token = token.replace(/^Bearer\s+/, '')
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)

        req.uid = decoded.uid
    } catch (e) {
        return res.status(401).send('Token inválido');
    }

    return next();
};