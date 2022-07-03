 const mongoose = require("mongoose");
 


exports.getCache = async (req, res) => {
    res.json({ data: CACHE });
}
 
exports.getPokemon = async (req, res) => {
    const { name } = req.params;
    const axios = require("axios").default;
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const pokemon = await dbFind(name);
    console.log('getPokemon')
    if (pokemon == '0') {
      console.log('No existe el pokemon')
    } else {
      console.log(pokemon.name);
      console.log(pokemon.dateCreate);    
      return res.json({ name, data: pokemon.information, isCached: true });
    }
    
    let responseData;
    try {
        const {data} = await axios.get(url);
        responseData  = data;    
        dbCreate(name,responseData);
    } catch {
        res.json({data: 'InvalidPokemon'});         
    }
     
    res.json({ name, data: responseData, isCached: false });    
};

exports.getEvolution = async (req,res) => {
    const { name } = req.params;
    const evolution = "evolution" + name;
    const url = `https://pokeapi.co/api/v2/pokemon-species/${name}`
    const pokemon = await dbFind(name);
    if (pokemon.evolutions == '0') {

    }else {
      return res.json({ name, data: pokemon.evolutions, isCached: true });
    }
    const api = await fetch(url); if (api.ok) {
    const data = await api.json(); console.log(data); 
    try {        
        const urlE = data.evolution_chain.url;
        const apiE = await fetch(urlE); if (apiE.ok){
        const dataE = await apiE.json(); 
        console.log(dataE); 
        try {
            dbUpdateEvolutions(name,dataE)                
            res.json({ name, data: dataE, isCached: false });
        } catch (error) {
           console.log(error);                 
        }
        }       
        res.json({ name, data: data, isCached: false });
      } catch (error) {
          console.log(error);       
        }
      }
}

exports.getLocation = async (req, res) => {
    const { name } = req.params;
    const location = "location" + name;
    const url = `https://pokeapi.co/api/v2/pokemon/${name}/encounters`;  

    const pokemon = await dbFind(name);
    if (pokemon.locations == '0') {
      const api = await fetch(url); if (api.ok) {
        try {
              const data = await api.json();
              console.log(data);
              dbUpdateLocations(name,data);              
              res.json({ name, data: data, isCached: false });
            } catch (error) {
                    console.log(error);                     
            }}
    } else {
      return res.json({ name, data: pokemon.locations, isCached: true });
    }
};


// Base de datos

async function dbFind(pokeName) { // tipo: i = information, s = sprites, l = locations,e = evolutions
  try {
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
    const pokemons = db.collection("pokemons");
    const query = { name: pokeName };
    const options = {
      
      sort: { "name": -1 },       
      projection: { _id: 0, name: 1, information:1,sprites: 1,locations:1,evolutions: 1,dateCreate: 1 },      
    };
    const pokemon = await pokemons.findOne(query, options);
     
      if (pokemon) {
        const fecha = new Date();
        const dif = fecha - pokemon.dateCreate;
        const segundos = dif / 1000;
        const tiempo = Math.abs(segundos);
        console.log("tiempo");
        console.log(tiempo);
        if (tiempo > 10 ){
          const filter = { name: pokeName };        
          const options = { upsert: true };      
          const updateDoc = {
              $set: {
                    dateCreate: fecha
              },
          };
          const result = await pokemons.updateOne(filter, updateDoc, options);
          console.log(
         `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
       );
        }
        return pokemon;
     } else{
      return '0';
     }
      
    
    return pokemon;
  } finally {    
    //db.disconnect();
       }
}

async function dbCreate(pokeName,data) {  
  try {
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
    const pokemons = db.collection("pokemons");
	const fecha = new Date();
  
    const doc = {
      name: pokeName,
      information: data,
      sprites: data.sprites,
      locations: "0",
      evolutions: "0",
	  dateCreate: fecha,
	  
    }
    const result = await pokemons.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
       
  }
}
async function dbUpdateEvolutions(pokeName,data) {  
  try {
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
    const pokemons = db.collection("pokemons");
	      
       const filter = { name: pokeName };
        
       const options = { upsert: true };
      
       const updateDoc = {
         $set: {
           evolutions: data
         },
       };
       const result = await pokemons.updateOne(filter, updateDoc, options);
       console.log(
         `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
       );
     } finally {
        
     }
   }
   async function dbUpdateLocations(pokeName,data) {  
    try {
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
      const pokemons = db.collection("pokemons");
          
         const filter = { name: pokeName };
          
         const options = { upsert: true };
        
         const updateDoc = {
           $set: {
             locations: data
           },
         };
         const result = await pokemons.updateOne(filter, updateDoc, options);
         console.log(
           `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
         );
       } finally {
          
       }
     }
  