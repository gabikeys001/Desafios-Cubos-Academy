const knex = require('../conexao')
const { schemaCadastroPedido } =
    require('../validacao/schemas')

async function cadastrarPedido(req, res) {
    let { cliente_id, observacao, pedido_produtos } = req.body
    let valor_total = 0
    try {
        await schemaCadastroPedido.validate(req.body)
        const clienteEncontrado = await knex('clientes')
            .where({ id: cliente_id })
        if (!clienteEncontrado) return res.status(404)
            .json(`Cliente não encontrado no ID informado.`)
        const [pedidoCadastrado] = await knex('pedidos')
            .insert({ cliente_id, observacao, valor_total }).returning('*')
        if (!pedidoCadastrado) return res.status(400)
            .json(`Falha no cadastro do pedido.`)
        for (pp of pedido_produtos) {
            const produtoEncontrado = await knex('produtos')
                .where({ id: pp.produto_id }).first()
            if (!produtoEncontrado) {
                await knex('pedidos').where({ id: pedidoCadastrado.id }).del()
                return res.status(404)
                    .json('Produto não encontrado, falha no cadastro do pedido.')
            }
            let { valor, quantidade_estoque } = produtoEncontrado
            if (pp.quantidade_produto > quantidade_estoque) {
                await knex('pedidos').where({ id: pedidoCadastrado.id }).del()
                return res.status(404)
                    .json(`Quantidade insuficiente em estoque, falha no cadastro do pedido.`)
            }
            quantidade_estoque -= pp.quantidade_produto
            const estoqueAtualizado = await knex('produtos').update({ quantidade_estoque })
                .where({ id: pp.produto_id })
            if (!estoqueAtualizado) return res.status(400).json(`Falha no cadastro do pedido`)
            pp.pedido_id = pedidoCadastrado.id, pp.valor_produto = valor,
                valor_total += pp.quantidade_produto * valor
        }
        const pedidoValorTotal = await knex('pedidos').update({ valor_total })
        if (!pedidoValorTotal) return res.status(400).json(`Falha no cadastro do pedido.`)
        const [produtosCadastrados] = await knex('pedido_produtos')
            .insert(pedido_produtos).returning('*')
        if (!produtosCadastrados) {
            await knex('pedidos')
                .where({ id: pedidoCadastrado.id }).del()
            return res.status(400).json(`Não foi possível cadastrar o pedido`)
        }
        return res.status(201).json({
            pedidoCadastrado, produtosCadastrados
        })
    } catch (error) { return res.status(400).json(error.message) }
}
function obterPedidos(pedidos, pedidoProdutos) {
    pedidos.forEach(pedido => {
        pedido, pedido.pedido_produtos =
            pedidoProdutos.filter(pp => pp.pedido_id == pedido.id)
    })
}
async function listarPedidos(req, res) {
    const { cliente_id } = req.query
    try {
        let pedidos, pedidoProdutos = await knex('pedido_produtos')
        if (!cliente_id) {
            pedidos = await knex('pedidos')
            obterPedidos(pedidos, pedidoProdutos)
            return res.status(200).json(pedidos)
        }
        pedidos = await knex('pedidos').where({ cliente_id })
        obterPedidos(pedidos, pedidoProdutos)
        return res.status(200).json(pedidos)
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = { cadastrarPedido, listarPedidos }
