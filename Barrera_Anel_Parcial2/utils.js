(() => {
    const Utils = {
      settings: {
        backendBaseUrl: "https://pokeapi.co/api/v2",
        speciesUrl:"https://pokeapi.co/api/v2/pokemon-species",
      },
      getFormattedBackendUrl: ({ query, searchType }) => {
        return `${Utils.settings.backendBaseUrl}/${searchType}/${query}`;
      },
      getFormattedSpeciesUrl: ({ query }) => {
        return `${Utils.settings.speciesUrl}/${query}`;
      },
      getAbility: ({ query, searchType = "ability"  }) => {         
        return Utils.fetch({
            url: Utils.getFormattedBackendUrl({ query, searchType }),
            searchType,
        });
      },
      getPokemon: async ({ query, searchType = "pokemon" }) => {
          const speciesR =  await Utils.fetch({
          url: Utils.getFormattedSpeciesUrl({ query }),
          searchType,
        });
        console.log("aqui");
        const [response, chain]  = await Promise.all([ 
          Utils.fetch({
          url: Utils.getFormattedBackendUrl({
             query,
             searchType }),
          searchType,
        }),
        Utils.fetch({
          url: speciesR?.evolution_chain?.url,
          searchType: "evolution-chain",
      })]);
      let evoChain = [];
      let evoData = chain.chain;
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
             
      console.log("aca");       
      console.log({ evoChain });
      response.evolutionChain = evoChain;
        return response;
      },
      fetch: async ({ url, searchType }) => {
        try {
          console.log({ url });
          const rawResponse = await fetch(url);
          if (rawResponse.status !== 200) {
            throw new Error(`${searchType} not found`);
          }          
          return rawResponse.json();
        } catch (error) {
          throw error;
        }
      },      
    };
    document.Utils = Utils;
  })();