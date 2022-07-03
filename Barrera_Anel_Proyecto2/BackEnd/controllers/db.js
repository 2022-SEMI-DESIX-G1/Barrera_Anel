const mongoose = require("mongoose");
mongoose.connect('mongodb://0.0.0.0:27017/admin',
  {
    useNewUrlParser: true,    
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

var Schema = mongoose.Schema;

var PokemonSchema = new Schema({
  name: String,
  information:String,
  sprites:String,
  locations:String,
  evolutions:String,
  dateCreate: Date
});

// Compile model from schema
var PokemonModel = mongoose.model("Pokemon", PokemonSchema);

PokemonModel.create({ name: "also_awesome" }, function (err, awesome_instance) {
  if (err) {
    console.log("Error...");
    console.log({ err });
    return;
  }
  console.log("Saved...");
});
const fecha = new Date();
console.log(fecha)   

const pokemonObject = new PokemonModel({
  name: 'pikachu',
  dateCreate: fecha
});
const pokemons = db.collection("pokemons");
const query = { name: "pikachu" };
const options = {
  // sort matched documents in descending order by rating
  sort: { "name": -1 },
  // Include only the `title` and `imdb` fields in the returned document
  projection: { _id: 0, name: 1, dateCreate: 1 },
};
const pokemon =  pokemons.findOne(query, options);
console.log(pokemon);
/*
//Guardar ***
pokemonObject.save((err, data) => {
  if (err)
      console.log('Error in saving = ' + err);
  if (data)
      console.log('Saved to DB = ' + data)
}
);*/
