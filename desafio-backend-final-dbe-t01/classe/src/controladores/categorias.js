const knex = require('../conexao')
async function listarCategorias(req, res) {
    try {
        const categorias = await knex('categorias')
        return res.status(200).json(categorias)
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = listarCategorias 