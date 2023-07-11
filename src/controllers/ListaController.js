const connection = require("../database/connection");
const constants = require("../constants/constants");
const jwt = require("jsonwebtoken");
const responseModel = {
  success: false,
  found: 0,
  data: [],
  error: "",
};

module.exports = {
  async createList(req, res) {
    const response = { ...responseModel };
    response.data = [];
    const { ds_lista } = req.body;
    const idUser = req.userId;
    let query = "";

    query = ds_lista
      ? `INSERT INTO tb_listas (id_usuario, ds_lista) VALUES (${idUser}, '${ds_lista}')`
      : `INSERT INTO tb_listas (id_usuario) VALUES (${idUser})`;

    try {
      const [, data] = await connection.query(query);
      response.success = data.length;
      response.data = constants["201"].listCreated;
      response.found = data.length;
    } catch(e) {
      response.error = constants["422"].requiredfields;
      console.log(e)
    }

    return res.json(response);
  },

  async deleteList(req, res) {
    const response = { ...responseModel };
    response.data = [];
    const  id_lista = req.param("idList");
    const idUser = req.userId;
    let query = "";

    query = `
      SET FOREIGN_KEY_CHECKS = 0;
      DELETE FROM tb_listas WHERE id_lista = ${id_lista} AND id_usuario = ${idUser};
      SET FOREIGN_KEY_CHECKS = 1;
      `

    try {
      const [, data] = await connection.query(query);
      response.success = data.length;
      response.data = constants["204"].listDeleted;
      response.found = data.length;
    } catch(e) {
      response.error = query
      // response.error = constants["404"].noListsFound;
      console.log(e)
    }

    return res.json(response);
  },

  async getUserLists(req, res) {
    const response = { ...responseModel };
    const idUser = req.userId;
    response.data = [];
    let query = "";

    query = `SELECT id_usuario FROM tb_usuario WHERE id_usuario = ${idUser}`;
    const [, outData] = await connection.query(query);

    if (outData.length < 1) {
      response.error = constants["404"].userNotFound;
    } else {
      try {
        const [, data] = await connection.query(`
          SELECT * FROM tb_listas WHERE id_usuario = ${idUser} ORDER BY id_lista DESC
        `);
        response.success = data.length > 0;
        if (response.success) {
          response.success = true;
          response.found = data.length;
          response.data = data;
        } else {
          response.error.push(constants["404"].noListsFound);
        }
      } catch (error) {
        console.log(error);
      }
    }

    return res.json(response);
  },

  async getListProducts(req, res) {
    const response = { ...responseModel };
    const idList = req.params.id;
    response.data = [];

    try {
      const [, data] = await connection.query(`
      SELECT * FROM tb_produtos_by_list WHERE id_lista = ${idList}
      `);
      response.success = data.length > 0;
      if (response.success) {
        const query = `
        SELECT
        tb_produtos.id_produto, tb_produtos.ds_produto,
        tb_produtos.cd_barras, tb_produtos.url_imagem,
        tb_produtos_by_list.id_pblist, tb_produtos_by_list.id_lista,
        tb_produtos_by_list.id_valor, tb_produtos_by_list.id_qtd
        FROM tb_produtos JOIN tb_produtos_by_list
        WHERE tb_produtos.id_produto = tb_produtos_by_list.id_produto AND id_lista = ${idList}      
        `;
        const [, data] = await connection.query(query);
        response.success = true;
        response.found = data.length;
        response.data = data;
      } else {
        response.error = "Nenhum item na lista";
      }
    } catch (error) {
      console.log(error);
    }

    return res.json(response);
  },

  async addProducts(req, res) {
    const response = { ...responseModel };
    let { id_lista, id_produto, id_valor, id_qtd } = req.body;
    response.data = [];
    let query = "";

    query = `
    INSERT INTO tb_produtos_by_list (id_lista, id_produto, id_valor, id_qtd) 
    VALUES (${id_lista}, ${id_produto}, ${id_valor}, ${id_qtd});
    `;
    
    
    try {
      if(id_qtd > 0){
        const data = await connection.query(query);
        console.log('DATA:', data);
        response.success = !!data;
        if (response.success) {
          // response.success = true;
          response.found = id_qtd;
          response.data = "Produto Inserido com Sucesso";
        } else {
          response.error = "Ocorreu algum erro!";
        }
      }else {
        response.error = "A quantia minima precisa ser 1";
      }
    } catch (error) {
      console.log(error);
      response.error = "Ocorreu um erro ao inserir o produto.";
    }


    return res.json(response);
  },
};
