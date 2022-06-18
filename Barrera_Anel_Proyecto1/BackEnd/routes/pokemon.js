const express = require('express')
const router = express.Router()
const pokemonController = require('../controllers/pokemon');
 
router.get("/pokemon/:name", pokemonController.getPokemon);
router.get("/pokemonEvolution/:name", pokemonController.getEvolution);
router.get("/pokemonLocation/:name", pokemonController.getLocation);
router.get("/cache", pokemonController.getCache); 

module.exports = router