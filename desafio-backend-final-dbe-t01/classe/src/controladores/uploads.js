const _ = process.env, supabase = require("@supabase/supabase-js")
    .createClient(_.SUPABASE_URL, _.SUPABASE_KEY)
const { schemaUpload } = require('../validacao/schemas')

function getStorage() { return supabase.storage.from('pdv') }
function getPublicUrl(nome) {
    const { publicURL, error: errorPublicURL } =
        getStorage().getPublicUrl(nome)
    if (errorPublicURL) return errorPublicURL
    return publicURL
}
async function uploadIMG(nome, imagem) {
    const buffer = Buffer.from(imagem, 'base64')
    const { error } = await getStorage().upload(nome, buffer)
    if (error) return error
    return getPublicUrl(nome)
}
async function excluirIMG(url) {
    const nome = string.split('pdv/')[1]
    const { error } = await getStorage().remove([nome])
    if (error) return error
    return true
}
async function upload(req, res) {
    const { imagem } = req.body
    const nome = 'img' + Date.now()
    try {
        schemaUpload.validate(req.body)
        const retorno = await uploadIMG(nome, imagem)
        if (retorno.message) return res.status(400).json(retorno.message)
        return res.status(201).json(retorno)
    } catch (error) { return res.status(400).json(error.message) }
}
module.exports = { excluirIMG, upload }