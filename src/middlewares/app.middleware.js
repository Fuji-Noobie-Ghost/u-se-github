import jwt from 'jsonwebtoken'

const verifyToken = (currentToken) => {
    return (req, res, next) => {
        if (currentToken !== null) {
            jwt.verify(currentToken, process.env.TOKEN_KEY, (err, decoded) => {
                if (err) res.redirect(400, '/')
                else req.user = decoded
                return next()
            })
        }
        else res.redirect(403, '/')
    }
}

export { verifyToken }