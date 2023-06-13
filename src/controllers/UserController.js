const connection = require("../database/connection");
const md5 = require("md5");
const constants = require("../constants/constants");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const SECRET = process.env.SECRET;

const responseModel = {
  success: false,
  data: [],
  error: "",
};
module.exports = {
  async user(req, res) {
    const response = { ...responseModel };
    const { user } = req.body;
    const [, data] = await connection.query(`
            SELECT id_usuario as id ,ds_usuario as nome,ds_email as email FROM tb_usuario WHERE '${user}' = ds_usuario OR '${user}' = ds_email
        `);
    response.success = data.length > 0;
    if (response.success) {
      response.data = data;
    } else {
      user !== undefined ? response.error = constants['404'].userNotFound : "";
      user === undefined ? response.error = constants['422'].userNotDefined : "";
    }

    return res.json(response);
  },

  async login(req, res) {
    const response = { ...responseModel };
    const { login, password } = req.body;
    const passwordEncrypted = password !== undefined ? md5(password) : "";

    try {
      const [, data] = await connection.query(`
      SELECT id_usuario as id, ds_email as email, ds_usuario as nome, ds_status
      FROM tb_usuario
      WHERE ds_email = "${login}"
      AND ds_senha = "${passwordEncrypted}"
  `);
      response.success = data.length > 0;
      if (response.success) {
        const token = jwt.sign({ userId: login }, SECRET, { expiresIn: 2592000 });
        response.data = data;
        response.data.push({ auth: true, token });
        return res.json(response);
      } else {
        // login !== undefined && password !== undefined
        //   ? response.error.push("Login ou senha incorretos")
        //   : "";
        // login === undefined || password === undefined
        //   ? response.error.push("login: e password: é obrigatório")
        //   : "";
        res.status(401);
        response.error = constants['401'].userLoginError;
      }
    } catch (error) {
      console.log(error)
    }

    // setTimeout(() => {
    return res.json(response);
    // }, 1000);
  },

  async createUser(req, res) {
    const response = { ...responseModel };
    response.data = [];
    const { ds_usuario, id_uf, ds_email, ds_senha } = req.body;

    const [, data] = await connection.query(`
        SELECT * FROM tb_usuario WHERE ds_email = '${ds_email}'
    `);
    response.success = data.length > 0;

    if (response.success) {
      response.error = constants['409'].userAlreadyExist;
    } else {
      try {
        if (ds_usuario && id_uf && ds_email && ds_senha) {
          const passwordEncrypted = md5(ds_senha);
          const [, data] = await connection.query(`
                INSERT INTO tb_usuario (ds_usuario, id_uf, ds_email, ds_senha, ds_status, ds_permissao) VALUES ('${ds_usuario}', '${id_uf}', '${ds_email}', '${passwordEncrypted}', '1', '0');
            `);
          // response.success = data.length > 0;
          response.success = true;
          response.data = constants['201'].userSuccess;
        } else {
          response.error = constants['422'].requiredfields;
        }
      } catch (error) {
        console.log(error);
      }
    }

    return res.json(response);
  },
};
