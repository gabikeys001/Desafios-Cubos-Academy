const { schemaAuth } = require('../validacao/schemas')
const knex = require('../conexao')
const jwt = require('jsonwebtoken')

async function verificarLogin(req, res, next) {
    const { authorization } = req.headers
    try {
        await schemaAuth.validate(req.headers)
        const token = authorization.replace('Bearer ', '').trim()
        const { id } = await jwt.verify(token, process.env.TOKEN_KEY)
        if (!id) return res.status(401).json('Token inválido.')
        const encontrado = await knex('usuarios').where({ id }).first()
        if (!encontrado) return res.status(401).json('Token inválido.')
        const { senha, ...usuario } = encontrado
        req.usuario = usuario
        next()
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = verificarLogin