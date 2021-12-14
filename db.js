var mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost:27017/trabFinal');

var userSchema = new mongoose.Schema(
  {
    nome: String,
    email: String,
    senha: String,
  },
  { collection: "usercollection" }
);

var wineSchema = new mongoose.Schema(
  {
    nome: String,
    produtor: String,
    pais_origem: String,
    tipo_vinho: String,
    tipo_uva: String,
    nota: Number,
    qtd_comentarios: Number,
    imagem: String,
  },
  { collection: "winecollection" }
);

var wineHarmonizationSchema = new mongoose.Schema(
  {
    wine_id: String,
    comida: String,
  },
  { collection: "wineharmonizationcollection" }
);

var wineUserSchema = new mongoose.Schema(
  {
    user_id: String,
    wine_id: String,
  },
  { collection: "wineusercollection" }
);

var reviewSchema = new mongoose.Schema(
  {
    user_id: String,
    user_name: String,
    wine_id: String,
    nota: Number,
    data: Date,
    comentario: String,
  },
  { collection: "reviewcollection" }
);

module.exports = {
  Mongoose: mongoose,
  UserSchema: userSchema,
  WineSchema: wineSchema,
  WineHarmonizationSchema: wineHarmonizationSchema,
  WineUserSchema: wineUserSchema,
  ReviewSchema: reviewSchema,
};
