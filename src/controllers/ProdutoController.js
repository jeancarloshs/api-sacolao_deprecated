const connection = require("../database/connection");
const { json } = require("body-parser");
const responseModel = {
  success: false,
  found: 0,
  data: [],
  error: [],
};
module.exports = {
  async produtosCOD(req, res) {
    const response = { ...responseModel };
    const codigo = req.param("codigo");
    response.error = [];
    const [, data] = await connection.query(`
            SELECT id_produto as id, ds_produto as produto, cd_barras as codigo, url_imagem as imagem FROM tb_produtos where cd_barras = ${codigo}
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.found = data.length;
      response.data = data;
    } else {
      response.error.push("Nenhum produto encontrado!");
    }

    return res.json(response);
  },
  async produtosDS(req, res) {
    const response = { ...responseModel };
    const descricao = req.param("descricao");
    response.error = [];
    const [, data] = await connection.query(`
            SELECT id_produto as id, ds_produto as produto, cd_barras as codigo, url_imagem as imagem FROM tb_produtos where ds_produto like '%${descricao}%'
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.found = data.length;
      response.data = data;
    } else {
      response.error.push("Nenhum produto encontrado!");
    }

    return res.json(response);
  },
  async todos(req, res) {
    const response = { ...responseModel };
    response.error = [];
    const [, data] = await connection.query(`
            SELECT id_produto as id, ds_produto as produto, cd_barras as codigo, url_imagem as imagem FROM tb_produtos
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.found = data.length;
      response.data = data;
    } else {
      response.error.push("Nenhum produto encontrado!");
    }

    return res.json(response);
  },
};
