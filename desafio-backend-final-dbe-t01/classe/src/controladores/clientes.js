const knex = require('../conexao')

function mostrarMensagem(tipo, res) {
  res.status(400).json({
    mensagem: `Já existe cliente cadastrado com o ${tipo} informado.`
  })
}
const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf } = req.body;
  if (!nome) {
    return res.status(400).json({ mensagem: "É obrigatório preencher o campo nome" });
  }
  if (!email) {
    return res.status(400).json({ mensagem: "É obrigatório preencher o campo email" });
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: "É obrigatório preencher o campo cpf" });
  }

  try {

    const cpfEncontrado = await knex('clientes').where({ cpf }).first()
    const emailEncontrado = await knex('clientes').where({ email }).first()

    if (emailEncontrado) {
      return mostrarMensagem('email', res)
    }
    if (cpfEncontrado) {
      return mostrarMensagem('CPF', res)
    }
    const clienteCadastrado = await knex('clientes').insert({ nome, email, cpf }).returning('*')
    if (!clienteCadastrado) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível cadastrar o cliente" });
    }

    return res.status(201).json(clienteCadastrado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const atualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: "É obrigatório preencher o campo nome" });
  }
  if (!email) {
    return res.status(400).json({ mensagem: "É obrigatório preencher o campo email" });
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: "É obrigatório preencher o campo cpf" });
  }

  try {
    const idEncontrado = await knex("clientes").where({ id }).first()
    if (!idEncontrado) {
      return res.status(404).json("Não existe cliente com o id informado")
    }

    const cpfEncontrado = await knex('clientes').where({ cpf }).first()
    const emailEncontrado = await knex('clientes').where({ email }).first()

    if (emailEncontrado) {
      return mostrarMensagem('email', res)
    }

    if (cpfEncontrado) {
      return mostrarMensagem('CPF', res)
    }
    console.log(req.body)
    const [clienteAtualizado] = await knex('clientes')
      .update({ nome, email, cpf }).where({ id }).returning('*')

    if (!clienteAtualizado) {
      return res.status(400).json('Não foi possível atualizar os dados do cliente')
    }
    return res.status(200).json(clienteAtualizado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex('clientes')
    if (!clientes) return res.status(404).json(`Nenhum cliente encontrado.`)
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await knex("clientes").where({ id }).first()
    if (!cliente) {
      return res.status(404).json("Não existe cliente com o id informado")
    }
    return res.status(200).json(cliente)
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarCliente,
  atualizarCliente,
  listarClientes,
  detalharCliente
};
