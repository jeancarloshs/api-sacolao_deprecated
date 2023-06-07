const connection = require("../database/connection");
const md5 = require("md5");
const { json } = require("body-parser");
const responseModel = {
  success: false,
  found: [],
  data: [],
  error: "",
};
module.exports = {
  async migrar(req, res) {
    const response = { ...responseModel };
    response.error = [];
    let jsonFile = require("../../../../arquivos/listaProdutos3.json");
    let queries = [];
    jsonFile = JSON.stringify(jsonFile);
    jsonFile = JSON.parse(jsonFile);
    jsonFile.forEach((element) => {
      let imagem = element.imagem;
      let nome = element.nome.replaceAll("'", "");
      let gtin = element.gtin;
      let categoriaProduto = element.categoriaProduto.replaceAll("'", "");
      let marcaProduto = element.marcaDoProduto.replaceAll("'", "");
      let valorMedio = element.valorMedio;
      queries.push(
        `INSERT INTO tb_produtos (ds_produto, cd_barras, id_unidade, ds_unidade, ds_categoria, id_valores, url_imagem) VALUES ('${nome}','${gtin}','UN','Unidade','${categoriaProduto}',${
          valorMedio === null ? null : `'${valorMedio}'`
        }, '${imagem}')`
      );
    });

    async function inserir(query) {
      try {
        const [, data] = await connection.query(query);
      } catch (err) {
        console.log(err);
      }
    }

    queries.forEach((query) => {
      inserir(query);
    });
  },
  async inserirJson(req, res) {
    const response = { ...responseModel };
    const { file } = req.body;
    const jsonFile = require(`../../arquivos/${file}.json`);
    response.error = [];
    response.data = [];
    let queries = [];
    jsonFile?.forEach((produto) => {
      // console.log('produtos', produto)
      let imagem = produto?.imagem;
      let nome = produto?.nome?.replaceAll("'", "");
      let gtin = produto?.gtin;
      let categoriaProduto = produto?.categoriaProduto?.replaceAll("'", "");
      let marcaProduto = produto?.marcaDoProduto?.replaceAll("'", "");
      let valorMedio = produto?.valorMedio;
      queries.push(
        `INSERT INTO tb_produtos (ds_produto, cd_barras, id_unidade, ds_unidade, ds_categoria, id_valores, url_imagem) VALUES ('${nome}','${gtin}','UN','Unidade','${categoriaProduto}',${
          valorMedio === null ? null : `'${valorMedio}'`
        }, '${imagem}')`
      );
    });

    async function inserir(query) {
      try {
        const [, data] = await connection.query(query);
        response.success = true
      } catch (err) {
        response.success = false
        response.error = "Falha ao tentar inserir produto";
        console.log(err);
      }
    }
    
    queries.forEach((query) => {
      inserir(query);
      response.data.push("Inserido com sucesso!")
    });
    response.found = queries.length
    return res.json(response);
  },
};
