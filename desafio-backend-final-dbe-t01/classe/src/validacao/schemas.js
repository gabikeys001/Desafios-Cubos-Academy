const yup = require('./configuracao')
const str = yup.string().required()
const num = yup.number().required()

const schemaCadastroUsuario = yup.object().shape({
    nome: str.strict(), email: str.email(), senha: str
})
const schemaLogin = yup.object().shape({
    email: str.email(), senha: str
})
const schemaAuth = yup.object().shape({
    authorization: yup.string().required('Não autorizado.')
})
const schemaRedefinirSenha = yup.object().shape({
    email: str.email(), senha_antiga: str, senha_nova: str
})
const schemaCadastroProduto = yup.object().shape({
    descricao: str, quantidade_estoque: num.strict().min(1),
    valor: num.strict().min(1), categoria_id: num.strict()
})
const schemaUpload = yup.object().shape({ imagem: str })
const schemaCadastroPedido = yup.object().shape({
    cliente_id: num.strict().min(1),
    pedido_produtos: yup.array().of(yup.object().shape({
        produto_id: num.strict().min(1),
        quantidade_produto: num.strict().min(1)
    })).min(1)
})
module.exports = {
    schemaCadastroUsuario, schemaLogin, schemaAuth,
    schemaRedefinirSenha, schemaCadastroProduto, schemaUpload,
    schemaCadastroPedido
}