const bcrypt = require('bcrypt')
const knex = require('../conexao')
const { schemaCadastroUsuario, schemaRedefinirSenha } = require('../validacao/schemas')
const nodemailer = require('../nodemailer')

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body
    try {
        await schemaCadastroUsuario.validate(req.body)
        const encontrado = await knex('usuarios').where({ email }).first()
        if (encontrado) return res.status(400).json('O email já está cadastrado.')
        const senhaCrypto = await bcrypt.hash(senha, 10)
        const [{ id: _, senha: __, ...cadastrado }] = await knex('usuarios')
            .insert({ nome, email, senha: senhaCrypto }).returning('*')
        if (!cadastrado) return res.status(400).json('Não foi possível cadastrar o usuário')
        return res.status(201).json(cadastrado)
    } catch (error) { return res.status(400).json(error.message) }
}
async function redefinirSenha(req, res) {
    const { email, senha_antiga, senha_nova } = req.body
    try {
        await schemaRedefinirSenha.validate(req.body)
        const encontrado = await knex('usuarios').where({ email }).first()
        if (!encontrado) return res.status(401).json('Email ou senha inválidos.')
        const senhaCorreta = await bcrypt.compare(senha_antiga, encontrado.senha)
        if (!senhaCorreta) return res.status(401).json('Email ou senha inválidos.')
        const senhaCrypto = await bcrypt.hash(senha_nova, 10)
        const atualizado = await knex('usuarios').update({ senha: senhaCrypto })
        if (!atualizado) return res.status(400).json('Não foi possível alterar a senha do usuário')
        nodemailer.sendMail({
            from: '"API Desafio Final" <desafio@cubos.com>',
            to: email,
            subject: 'Alteração de senha',
            text: 'Parabéns, a sua senha foi alterada.'
        })
        return res.status(200).json('Senha alterada com sucesso.')
    } catch (error) { return res.status(400).json(error.message) }
}
function obterPerfil(req, res) {
    return res.status(200).json(req.usuario)
}
async function atualizarPerfil(req, res) {
    const { id } = req.usuario
    const { nome, email, senha } = req.body
    try {
        await schemaCadastroUsuario.validate(req.body)
        const encontrado = await knex('usuarios').where({ email }).first()
        if (encontrado) return res.status(400).json('Email já existe.')
        const senhaCrypto = await bcrypt.hash(senha, 10)
        const [{ id: _, senha: __, ...atualizado }] = await knex('usuarios')
            .update({ nome, email, senha: senhaCrypto }).where({ id }).returning('*')
        if (!atualizado) return res.status(400).json('Não foi possível atualizar o usuário')
        return res.status(200).json(atualizado)
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = {
    cadastrarUsuario, redefinirSenha,
    obterPerfil, atualizarPerfil
}