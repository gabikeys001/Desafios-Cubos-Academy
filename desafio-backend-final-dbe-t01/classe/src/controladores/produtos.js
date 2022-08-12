const knex = require('../conexao')
const { schemaCadastroProduto } = require('../validacao/schemas')
const { excluirIMG } = require('./uploads')

async function cadastrarProduto(req, res) {
    let { descricao, quantidade_estoque,
        valor, categoria_id, produto_imagem } = req.body
    try {
        await schemaCadastroProduto.validate(req.body)
        const categoriaEncontrada = await knex('categorias')
            .where({ id: categoria_id }).first()
        if (!categoriaEncontrada) return res.status(404)
            .json(`Categoria não encontrada.`)
        const [cadastrado] = await knex('produtos').insert({
            descricao, quantidade_estoque,
            valor, categoria_id, produto_imagem
        }).returning('*')
        if (!cadastrado) return res.status(400).json(`Não foi possível cadastrar o produto.`)
        return res.status(201).json(cadastrado)
    } catch (error) { return res.status(400).json(error.message) }
}
async function atualizarProduto(req, res) {
    const { id } = req.params
    let { descricao, quantidade_estoque,
        valor, categoria_id, produto_imagem } = req.body
    try {
        await schemaCadastroProduto.validate(req.body)
        const { produto_imagem: imgAtual, ...encontrado } = await knex('produtos')
            .where({ id }).first()
        if (!encontrado) return res.status(404)
            .json(`Produto não encontrado.`)
        const categoriaEncontrada = await knex('categorias')
            .where({ id: categoria_id }).first()
        if (!categoriaEncontrada) return res.status(404)
            .json(`Categoria não encontrada.`)
        //atualizar img no servidor
        if (imgAtual) {
            const excluida = await excluirIMG(imgAtual)
            if (!excluida) return res.status(400).json(excluida.message)
        }
        //atualização banco de dados
        const [atualizado] = await knex('produtos').update({
            descricao, quantidade_estoque,
            valor, categoria_id, produto_imagem
        }).where({ id }).returning('*')
        if (!atualizado) return res.status(400)
            .json(`Não foi possível atualizar o produto.`)
        return res.status(200).json(atualizado)
    } catch (error) { return res.status(400).json(error.message) }
}
async function listarProdutos(req, res) {
    const { categoria_id } = req.query
    try {
        let produtos
        if (categoria_id) {
            const categoriaEncontrada = await knex('categorias')
                .where({ id: categoria_id }).first()
            if (!categoriaEncontrada) return res.status(404).json(
                `Categoria não encontrada.`)
            produtos = await knex('produtos')
                .where({ categoria_id })
            if (produtos.length == 0) return res.status(404).json(
                `Nenhum produto encontrado na categoria ID "${categoria_id}"`)
        } else
            produtos = await knex('produtos')
        return res.status(200).json(produtos)
    } catch (error) { return res.status(400).json(error.message) }
}
async function detalharProduto(req, res) {
    const { id } = req.params
    try {
        const produtoEncontrado = await knex('produtos')
            .where({ id }).first()
        if (!produtoEncontrado) return res.status(404)
            .json(`Produto não encontrado.`)
        return res.status(200).json(produtoEncontrado)
    } catch (error) { return res.status(400).json(error.message) }
}
async function excluirProduto(req, res) {
    const { id } = req.params
    try {
        const produtoEncontrado = await knex('produtos')
            .where({ id }).first()
        if (!produtoEncontrado) return res.status(404)
            .json(`Produto não encontrado.`)
        const produtoComprado = await knex('pedido_produtos')
            .where({ id: produto_id })
        if (produtoComprado) return res.status(403)
            .json(`O produto não pode ser excluído, pois está incluso em algum pedido.`)
        const { produto_imagem } = produtoEncontrado
        //excluir img no servidor
        if (produto_imagem) {
            const excluida = await excluirIMG(produto_imagem)
            if (!excluida) return res.status(400).json(retorno.message)
        }
        //exclusão no banco de dados
        const [produtoExcluido] = await knex('produtos')
            .where({ id }).del().returning('*')
        if (!produtoExcluido) return res.status(400).json(
            `Não foi possível excluir o produto.`)
        return res.status(200).json(produtoExcluido)
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = {
    cadastrarProduto, atualizarProduto,
    listarProdutos, detalharProduto, excluirProduto
}