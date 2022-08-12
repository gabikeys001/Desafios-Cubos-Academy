const knex = require('../conexao')
const { schemaLogin } = require('../validacao/schemas')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function login(req, res) {
    const { email, senha } = req.body
    try {
        await schemaLogin.validate(req.body)
        const encontrado = await knex('usuarios').where({ email }).first()
        if (!encontrado) return res.status(401).json('Email ou senha inválidos.')
        const senhaCorreta = await bcrypt.compare(senha, encontrado.senha)
        if (!senhaCorreta) return res.status(401).json('Email ou senha inválidos.')
        const token = await jwt.sign({ id: encontrado.id }, process.env.TOKEN_KEY)
        const { id, senha: _, ...usuario } = encontrado
        return res.status(200).json({ ...usuario, token })
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = login