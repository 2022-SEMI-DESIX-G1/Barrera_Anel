const CACHE = {};
const ERROR = {};

exports.getCache = async (req, res) => {
    res.json({ data: CACHE });
}

exports.getPokemon = async (req, res) => {
    const { name } = req.params;
    const axios = require("axios").default;
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    
    if (CACHE[name]) {
        return res.json({ name, data: JSON.parse(CACHE[name]), isCached: true });
      }
      if (ERROR[name]) {
        return res.json({ name, data: JSON.parse(ERROR[name]), isCached: true });
      }
    
    let responseData;
    try {
        const {data} = await axios.get(url);
        responseData  = data;
        CACHE[name] = JSON.stringify(data);
    } catch {
        responseData = data;
        ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
      }
    //res.json({ data: responseData });
    res.json({ name, data: responseData, isCached: false });
    
};

exports.getEvolution = async (req,res) => {
    const { name } = req.params;
    const evolution = "evolution" + name;
    const url = `https://pokeapi.co/api/v2/pokemon-species/${name}`
    if (CACHE[evolution]) {
        return res.json({ name, data: JSON.parse(CACHE[evolution]), isCached: true });
      }
      if (ERROR[evolution]) {
        return res.json({ name, data: JSON.parse(ERROR[evolution]), isCached: true });
      }


    const api = await fetch(url); if (api.ok) {
        const data = await api.json(); console.log(data); try {        
        const urlE = data.evolution_chain.url;
        const apiE = await fetch(urlE); if (apiE.ok){
            const dataE = await apiE.json(); console.log(dataE); try {
                //res.json(dataE);
                CACHE[evolution] = JSON.stringify(dataE);
                res.json({ name, data: dataE, isCached: false });
            } catch (error) {
                console.log(error);
                ERROR[evolution] = JSON.stringify({ name, error: "Invalid Evolution." });
                }
        }
       // res.json(data);
        res.json({ name, data: data, isCached: false });
        } catch (error) {
        console.log(error);
        ERROR[evolution] = JSON.stringify({ name, error: "Invalid Evolution." });
        }
        }
}

exports.getLocation = async (req, res) => {
    const { name } = req.params;
     
    const url = `https://pokeapi.co/api/v2/pokemon/${name}/encounters`;  
     
    const api = await fetch(url); if (api.ok) {
    const data = await api.json(); console.log(data); try {
    res.json(data);
    } catch (error) {
    console.log(error);
    }
    }
};