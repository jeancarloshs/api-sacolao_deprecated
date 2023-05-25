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
    const codigo = req.params.codigo;
    response.error = [];
    const [, data] = await connection.query(`
            SELECT id_produto as id, ds_produto as produto, cd_barras as codigo, url_imagem as imagem FROM tb_produtos where cd_barras = ${codigo}
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.found = data.length;
      response.data = data;
    } else {
      response.error.push(constants.noProductsFound);
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
      response.error.push(constants.noProductsFound);
    }

    return res.json(response);
  },
  async todos(req, res) {
    const response = { ...responseModel };
    response.error = [];
    const [, data] = await connection.query(`
            SELECT COUNT(*) as Prod_Total FROM tb_produtos
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.found = data.length;
      response.data = data;
    } else {
      response.error.push(constants.noProductsFound);
    }

    return res.json(response);
  },
  async removerDuplicado(req, res) {
    const response = { ...responseModel };
    response.error = [];
    response.data = [];
    const [, data] = await connection.query(`
        SELECT cd_barras AS codigo , ds_produto AS produto FROM tb_produtos GROUP BY cd_barras, ds_produto HAVING COUNT(cd_barras)>1 AND COUNT(ds_produto)>1
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.found = data.length;
      try {
        const query = `DELETE FROM tb_produtos WHERE (cd_barras, ds_produto) IN (
                        SELECT cd_barras, ds_produto FROM (
                          SELECT cd_barras, ds_produto, MIN(id_produto) AS min_id FROM tb_produtos GROUP BY cd_barras, ds_produto HAVING COUNT(*) > 1
                        ) AS subquery GROUP BY cd_barras, ds_produto
                        HAVING id_produto > MIN(min_id)
                      )`;
        const [, data] = await connection.query(query);
        response.data.push("Duplicados foram deletados!");
      } catch (err) {
        console.log(err);
      }
    } else {
      response.error.push("Nenhum produto duplicado!");
    }

    return res.json(response);
  },
};
