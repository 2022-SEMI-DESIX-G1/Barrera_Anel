const axios = require('axios').default;

const main = async () => {
  const {data} = await axios("https://pokeapi.co/api/v2/pokemon/pikachu");
  let numAbilities = data.abilities.length;
  let evoCh = ''; 
  let evoChain = [];
  console.log('Nombre: ' + data.name);
  console.log('Id: ' + data.id);
  console.log('Altura: ' + data.height + ' ; Peso: ' + data.weight);
  console.log('Habilidades: ');
  for (let i = 0;i < numAbilities; i++) {
    console.log(  data.abilities[i].ability.name);
  } 
    

  let endpoints = [data.species.url ];
 
  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread(({data: evolution_chain}) => {
      evoCh = evolution_chain.evolution_chain.url;
      const obtenerEvoluciones = async () => {
        const res = await axios.get(`${evoCh}`);        
      let evoData = res.data.chain;
      do {
        let numberOfEvolutions = evoData.evolves_to.length;  
        evoChain.push({
          "species_name": evoData .species.name,
          "species_url": evoData .species.url,
          "is_baby": !evoData ? 1 : evoData .is_baby          
        });
        if(numberOfEvolutions > 1) {
          for (let i = 1;i < numberOfEvolutions; i++) { 
            
            evoChain.push({
              "species_name": evoData.evolves_to[i].species.name,
              "species_url": evoData.evolves_to[i].species.url,
              "is_baby": !evoData.evolves_to[i]? 1 : evoData.evolves_to[i].is_baby
              
           });
          
          }
        }        
      
        evoData = evoData.evolves_to[0];
        
       
      } while (evoData != undefined && evoData.hasOwnProperty('evolves_to'));
    console.log('Evoluciones:')
    const evoChainList = evoChain.map(
      ({species_name,species_url,is_baby}) => {
          console.log(species_name);
      });
     
    
       
};
  obtenerEvoluciones() ;
  
     
    })
  );
  //console.log(evoCh);
  
           // const res = await axios.get(`${evoCh}`);
           //console.log(res.data.chain);
           //console.log(evoCh);
     
  
 

  

} ;

main();
