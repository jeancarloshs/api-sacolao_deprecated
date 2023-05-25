const connection = require("../database/connection");
const { json } = require("body-parser");
const constants = require("../constants/constants");
const { query } = require("express");
const responseModel = {
  success: false,
  found: 0,
  data: [],
  error: [],
};

module.exports = {
  async criaLista(req, res) {
    const response = { ...responseModel };
    response.data = [];
    response.error = [];
    const { id_user, ds_lista } = req.body;
    let query = "";

    query = ds_lista
      ? `INSERT INTO tb_listas (id_usuario, ds_lista) VALUES (${id_user}, '${ds_lista}')`
      : `INSERT INTO tb_listas (id_usuario) VALUES (${id_user})`;

    if (id_user) {
      const [, data] = await connection.query(query);
      response.success = data.length;
      response.data.push(`Lista cadastrada com sucesso`);
      response.found = data.length;
    } else {
      response.error.push(constants.requiredfields);
    }

    return res.json(response);
  },

  async getUserLists(req, res) {
    const response = { ...responseModel };
    let idUser = req.params.id;
    response.data = [];
    response.error = [];
    let query = "";

    // query = `SELECT EXISTS(SELECT 1 FROM tb_usuario WHERE id_usuario = ${idUser}) AS exists_value;`
    query = `SELECT id_usuario FROM tb_usuario WHERE id_usuario = ${idUser}`
    const [, outData] = await connection.query(query)

    if(outData.length < 1) {
      response.error.push(constants.userNotFound)
    } else {
      try {
        const [, data] = await connection.query(`
          SELECT * FROM tb_listas WHERE id_usuario = ${idUser}
        `);
        response.success = data.length > 0;
        if (response.success) {
          response.success = true;
          response.found = data.length;
          response.data = data;
        } else {
          response.error.push("Nenhuma lista foi encontrada");
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
    response.error = [];

    try {
      const [, data] = await connection.query(`
      SELECT * FROM tb_produtos_by_list WHERE id_lista = ${idList}
      `);
      response.success = data.length > 0;
      if (response.success) {
        const query = `
        SELECT tb_produtos.ds_produto, tb_produtos.cd_barras, tb_produtos.url_imagem, tb_produtos_by_list.id_pblist, tb_produtos_by_list.id_valor, tb_produtos_by_list.id_qtd
        FROM tb_produtos JOIN tb_produtos_by_list
        WHERE tb_produtos.id_produto = tb_produtos_by_list.id_produto
        `
        const [, data] = await connection.query(query);
        response.success = true;
        response.found = data.length;
        response.data = data;
      } else {
        response.error.push("Nenhum item na lista");
      }
    } catch (error) {
      console.log(error);
    }

    return res.json(response);
  },

  // async addProducts(req, res) {
  //   const response = { ...responseModel }
  //   response.data = []
  //   response.error = []
  //   response.found = []
  //   const { } = req.body;
  // }
};
