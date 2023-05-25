const connection = require("../database/connection");
const md5 = require("md5");
const { json } = require("body-parser");
const { response } = require("express");
const constants = require("../constants/constants");

const responseModel = {
  success: false,
  data: [],
  error: [],
};
module.exports = {
  async user(req, res) {
    const response = { ...responseModel };
    response.error = [];
    const { user } = req.body;
    const [, data] = await connection.query(`
            SELECT id_usuario as id ,ds_usuario as nome,ds_email as email FROM tb_usuario WHERE '${user}' = ds_usuario OR '${user}' = ds_email
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.data = data;
    } else {
      user !== undefined
        ? response.error.push(constants.userNotFound)
        : "";
      user === undefined ? response.error.push("user: é obrigatório") : "";
    }

    return res.json(response);
  },

  async login(req, res) {
    const response = { ...responseModel };
    response.error = [];
    const { login, password } = req.body;
    console.log(req.body);
    const passwordEncrypted = password !== undefined ? md5(password) : "";

    const [, data] = await connection.query(`
            SELECT user_id as id, user_email as email, user_nome as nome, user_tipo, user_ativo FROM tbUser WHERE '${login}' = user_email AND '${passwordEncrypted}' = user_senha
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.data = data;
    } else {
      login !== undefined && password !== undefined
        ? response.error.push("Login ou senha incorretos")
        : "";
      login === undefined || password === undefined
        ? response.error.push("login: e password: é obrigatório")
        : "";
    }

    // setTimeout(() => {
    return res.json(response);
    // }, 1000);
  },

  async createUser(req, res) {
    const response = { ...responseModel };
    response.data = [];
    response.error = [];
    const { ds_usuario, id_uf, ds_email, ds_senha } = req.body;

    const [, data] = await connection.query(`
        SELECT * FROM tb_usuario WHERE ds_email = '${ds_email}'
    `);
    response.success = data.length > 0;

    if (response.success) {
      response.error.push(constants.userAlreadyExist);
    } else {
      try {
        if (ds_usuario && id_uf && ds_email && ds_senha) {
          const passwordEncrypted = md5(ds_senha);
          const [, data] = await connection.query(`
                INSERT INTO tb_usuario (ds_usuario, id_uf, ds_email, ds_senha, ds_status, ds_permissao) VALUES ('${ds_usuario}', '${id_uf}', '${ds_email}', '${passwordEncrypted}', '1', '0');
            `);
          // response.success = data.length > 0;
          response.success = true;
          response.data.push(constants.userSuccess);
        } else {
          response.error.push(constants.requiredfields);
        }
      } catch (error) {
        console.log(error);
      }
    }

    return res.json(response);
  },
};
