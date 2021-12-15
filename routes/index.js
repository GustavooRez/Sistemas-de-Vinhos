var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var db = require("../db");
const jwt = require("jsonwebtoken");
const SECRET = "_d41d8cd98f00b204e9800998ecf8427e_";
mongoose.connect(
  "mongodb+srv://admin:admin@clustertrabfinal.u2byf.mongodb.net/web?retryWrites=true&w=majority",
  {
    useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

var Users = db.Mongoose.model(
  "usercollection",
  db.UserSchema,
  "usercollection"
);
var Wines = db.Mongoose.model(
  "winecollection",
  db.WineSchema,
  "winecollection"
);
var WineHarmonization = db.Mongoose.model(
  "wineharmonizationcollection",
  db.WineHarmonizationSchema,
  "wineharmonizationcollection"
);
var WineUser = db.Mongoose.model(
  "wineusercollection",
  db.WineUserSchema,
  "wineusercollection"
);
var Review = db.Mongoose.model(
  "reviewcollection",
  db.ReviewSchema,
  "reviewcollection"
);

var userGlobal = {};

// Rota de deslogar do sistema
router.get("/logout", function (req, res, next) {
  userGlobal = {};
  res.redirect("/");
});

// Rota de deslogar do sistema
router.get("/login", function (req, res, next) {
  res.render("login", { login_false: false });
});

// Rota de redirecionamento para tela de criação de usuário
router.get("/createUser", function (req, res, next) {
  res.render("createUser");
});

//Rota de redirecionamento para tela de criação de vinhos
router.get("/addWine", function (req, res, next) {
  Wines.find({}, function (erro_vinho, doc_vinho) {
    if (erro_vinho) {
      throw err;
    } else {
      let vinhos = JSON.parse(JSON.stringify(doc_vinho).toString());
      let nome_vinhos = vinhos.map(function (item, indice) {
        return item.nome;
      });

      nome_vinhos = nome_vinhos.join(", ");
      res.render("createWine", { user: userGlobal, nomeVinhos: nome_vinhos });
    }
  });
});

// Rota da página de usuários, verificação de credenciais do usuário
router.post("/searchUserLogin", function (req, res) {
  Users.findOne(
    { email: req.body.email, senha: req.body.senha },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result !== null) {
          let resultado = JSON.parse(JSON.stringify(result).toString());
          userGlobal = resultado;

          res.redirect("/myWines");
        } else {
          res.render("login", { login_false: true });
        }
      }
    }
  );
});

//Rota de adicionar novo usuário
router.post("/adduser", function (req, res) {
  var user = new Users({
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
  });
  user.save(function (err) {
    if (err) {
      console.log("Error! " + err.message);
      return err;
    } else {
      userGlobal = user;
      res.redirect("/myWines");
    }
  });
});

//Rota para encontrar os vinhos do usuário
router.get("/myWines", function (req, res, next) {
  WineUser.find({ user_id: userGlobal._id }, function (err, doc) {
    if (err) {
      throw err;
    } else {
      let resultado = JSON.parse(JSON.stringify(doc).toString());
      var resultado_ids_vinhos = resultado.map(function (item, indice) {
        return item.wine_id;
      });

      Wines.find(
        { _id: resultado_ids_vinhos },
        function (erro_vinho, doc_vinho) {
          if (erro_vinho) {
            throw err;
          } else {
            let resultado_final = JSON.parse(
              JSON.stringify(doc_vinho).toString()
            );

            res.render("myWines", {
              user: userGlobal,
              vinhos: resultado_final,
            });
          }
        }
      );
    }
  });
});

//Rota pra criar um vinho
router.post("/createWine", (req, res) => {
  Wines.findOne({ nome: req.body.nome_vinho }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result !== null) {
        let wine_result = JSON.parse(JSON.stringify(result).toString());

          (result.imagem = req.body.foto_wine),
          (result.pais_origem = req.body.pais_origem),
          (result.produtor = req.body.produtor),
          (result.tipo_vinho = req.body.tipo_vinho),
          (result.tipo_uva = req.body.tipo_uva);

        var wineHarmonization = new WineHarmonization({
          wine_id: wine_result._id,
          comida: req.body.harmonizacao_comida,
        });

        var wineUser = new WineUser({
          user_id: userGlobal._id,
          wine_id: wine_result._id,
        });

        result.save(function (erro_vinho) {
          if (erro_vinho) {
            console.log("Erro! " + erro_vinho.message);
            return erro_vinho;
          } else {
            wineHarmonization.save(function (erro_harmonizacao) {
              if (erro_harmonizacao) {
                console.log("Erro! " + erro_harmonizacao.message);
                return erro_harmonizacao;
              } else {
                wineUser.save(function (erro_user) {
                  if (erro_user) {
                    console.log("Erro! " + erro_user.message);
                    return erro_user;
                  } else {
                    res.redirect("/myWines");
                  }
                });
              }
            });
          }
        });
      } else {
        var wine = new Wines({
          nome: req.body.nome_vinho,
          imagem: req.body.foto_wine,
          pais_origem: req.body.pais_origem,
          produtor: req.body.produtor,
          tipo_vinho: req.body.tipo_vinho,
          tipo_uva: req.body.tipo_uva,
          nota: 0,
          qtd_comentarios: 0,
        });

        var wineHarmonization = new WineHarmonization({
          wine_id: wine._doc._id,
          comida: req.body.harmonizacao_comida,
        });

        var wineUser = new WineUser({
          user_id: userGlobal._id,
          wine_id: wine._doc._id,
        });

        wine.save(function (erro_vinho) {
          if (erro_vinho) {
            console.log("Erro! " + erro_vinho.message);
            return erro_vinho;
          } else {
            wineHarmonization.save(function (erro_harmonizacao) {
              if (erro_harmonizacao) {
                console.log("Erro! " + erro_harmonizacao.message);
                return erro_harmonizacao;
              } else {
                wineUser.save(function (erro_user) {
                  if (erro_user) {
                    console.log("Erro! " + erro_user.message);
                    return erro_user;
                  } else {
                    res.redirect("/myWines");
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});

//Rota para encontrar um vinho específico
router.get("/searchWine/:wine_id", (req, res, next) => {
  var vinho, harmonizacao, comentarios;
  Wines.findById(req.params.wine_id, function (erro_vinho, resposta_vinho) {
    if (erro_vinho) {
      throw erro_vinho;
    } else {
      vinho = JSON.parse(JSON.stringify(resposta_vinho).toString());

      WineHarmonization.find(
        { wine_id: req.params.wine_id },
        function (erro_harm, resposta_harmonizacao) {
          if (erro_harm) {
            throw erro_harm;
          } else {
            harmonizacao = JSON.parse(
              JSON.stringify(resposta_harmonizacao).toString()
            );

            let map_harmonizacao = harmonizacao.map(function (item, indice) {
              return item.comida;
            });

            harmonizacao = map_harmonizacao.join(", ");
            Review.find(
              { wine_id: req.params.wine_id },
              function (erro_review, resposta_review) {
                if (erro_review) {
                  throw erro_review;
                } else {
                  comentarios = JSON.parse(
                    JSON.stringify(resposta_review).toString()
                  );

                  res.render("winePage", {
                    user: userGlobal,
                    vinho: vinho,
                    harmonizacao: harmonizacao,
                    comentarios: comentarios,
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

//Rota para encontrar um usuário específico
router.get("/searchUser/:user_id", (req, res, next) => {
  var usuario, comentarios;
  Users.findById(req.params.user_id, function (erro_user, resposta_user) {
    if (erro_user) {
      throw erro_user;
    } else {
      usuario = JSON.parse(JSON.stringify(resposta_user).toString());

      Review.find(
        { user_id: req.params.user_id },
        function (erro_review, resposta_review) {
          if (erro_review) {
            throw erro_review;
          } else {
            comentarios = JSON.parse(
              JSON.stringify(resposta_review).toString()
            );

            comentarios.sort(function (a, b) {
              return new Date(b.data) - new Date(a.data);
            });

            res.render("userPage", {
              user: userGlobal,
              usuario: usuario,
              comentarios: comentarios,
            });
          }
        }
      );
    }
  });
});

//Rota para adicionar a review de um vinho
router.post("/addReview/:wine_id", (req, res, next) => {
  var review = new Review({
    user_id: userGlobal._id,
    user_name: userGlobal.nome,
    wine_id: req.params.wine_id,
    nota: req.body.nota,
    data: new Date(),
    comentario: req.body.comentario,
  });

  review.save(function (erro_review) {
    if (erro_review) {
      console.log("Erro! " + erro_review.message);
      return erro_review;
    } else {
      Review.find(
        { wine_id: req.params.wine_id },
        function (erro_review, resposta_review) {
          if (erro_review) {
            throw erro_review;
          } else {
            let avaliacoes = JSON.parse(
              JSON.stringify(resposta_review).toString()
            );

            let num_avaliacoes = avaliacoes.length;

            let map_avaliacoes = avaliacoes.map(function (item, indice) {
              return parseInt(item.nota);
            });

            let notas = 0;

            for (let index = 0; index < map_avaliacoes.length; index++) {
              notas = notas + parseInt(map_avaliacoes[index]);
            }

            notas = notas / num_avaliacoes;

            let wine_id_find = req.params.wine_id;

            Wines.findById(wine_id_find, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                if (result !== null) {
                  let wine_result = result;

                  wine_result.nota = notas.toFixed(2);
                  wine_result.qtd_comentarios = num_avaliacoes;

                  wine_result.save(function (erro_vinho) {
                    if (erro_vinho) {
                      console.log("Erro! " + erro_vinho.message);
                      return erro_vinho;
                    } else {
                      res.redirect("/myWines");
                    }
                  });
                }
              }
            });
          }
        }
      );
    }
  });
});

//Rotas de vinhos tela principal
//Se houver parametros, ele personaliza a busca
router.get("/", function (req, res, next) {

  Wines.find({}, function (erro_vinho, doc_vinho) {
    if (erro_vinho) {
      throw erro_vinho;
    } else {
      let resultadoVinhos = JSON.parse(JSON.stringify(doc_vinho).toString());

      res.render("index", { user: userGlobal, vinhos: resultadoVinhos });
    }
  });
});

router.post("/", function (req, res, next) {
  var conditions = {
    $and: [],
    $or: [],
  };

  if (req.body.nome !== undefined && req.body.nome !== "") {
    conditions.$and.push({ nome: req.body.nome });
  }

  if (req.body.produtor !== undefined && req.body.produtor !== "") {
    conditions.$and.push({ produtor: req.body.produtor });
  }

  if (req.body.pais_origem !== undefined && req.body.pais_origem !== "") {
    conditions.$and.push({ pais_origem: req.body.pais_origem });
  }

  if (req.body.tipo_vinho !== undefined && req.body.tipo_vinho !== "") {
    conditions.$and.push({ tipo_vinho: req.body.tipo_vinho });
  }

  if (req.body.tipo_uva !== undefined && req.body.tipo_uva !== "") {
    conditions.$and.push({ tipo_uva: req.body.tipo_uva });
  }

  if (
    req.body.nota !== undefined &&
    req.body.nota !== "" &&
    req.body.nota !== "todas"
  ) {
    for (let index = parseInt(req.body.nota); index <= 5; index++) {
      conditions.$or.push({ nota: index });
    }
  }

  if (conditions.$and.length == 0) {
    delete conditions["$and"];
  }

  if (conditions.$or.length == 0) {
    delete conditions["$or"];
  }

  Wines.find(conditions, function (erro_vinho, doc_vinho) {
    if (erro_vinho) {
      throw erro_vinho;
    } else {
      let resultadoVinhos = JSON.parse(JSON.stringify(doc_vinho).toString());

      res.render("index", { user: userGlobal, vinhos: resultadoVinhos });
    }
  });
});

module.exports = router;
