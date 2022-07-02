(() => {
    const App = {
      config: {
        apiBaseUrlPokemon: "http://localhost:3000/pokemon",
        apiBaseUrlEvolution: "http://localhost:3000/pokemonEvolution",
        apiBaseUrlLocation: "http://localhost:3000/pokemonLocation",
      },
      htmlElements: {
        form: document.querySelector(".pokemon-form"),
        input: document.querySelector("#pokemon-input"),
        cb1: document.querySelector("#checkbox-1"),
        cb2: document.querySelector("#checkbox-2"),
        cb3: document.querySelector("#checkbox-3"),
        pokemonInformation: document.querySelector("#pokemon-information"),
        pokemonSprites: document.querySelector("#pokemon-sprites"),
        pokemonLocation: document.querySelector("#pokemon-location"),
        pokemonEvolution: document.querySelector("#pokemon-evolution"),
      },
      init: () => {
        App.htmlElements.form.addEventListener(
          "submit",
          App.handlers.handleFormSubmit
        );
      },
      handlers: {
        handleFormSubmit: async (e) => {
          e.preventDefault();
          const pokemon = App.htmlElements.input.value;
          const sprites = App.htmlElements.cb1.checked;    
          const location = App.htmlElements.cb2.checked;    
          const evolution = App.htmlElements.cb3.checked;  
          let responsedata;      
          try {
          const url = App.utils.getUrlPokemon({ pokemon });           
         // console.log(url);
          
          const {data} = await axios.get(url);
          responsedata = data;
         // console.log(responsedata);
          var response;
          const searchType ="pokemon";
          
          response = responsedata.data;
          console.log(response);
          if (response == 'InvalidPokemon'){
            App.htmlElements.pokemonInformation.style.display = "block";
            App.htmlElements.pokemonInformation.innerHTML = App.templates.errorCard();
            } else {
            const renderedTemplate = App.templates.render({
              searchType,
              response,
            }); 
            App.htmlElements.pokemonInformation.style.display = "block";
            App.htmlElements.pokemonInformation.innerHTML = renderedTemplate;
        }
           
        } catch (error){
          App.htmlElements.pokemonInformation.innerHTML = `<h1>${error}</h1>`;
        }
        if (sprites === true){
          try {            
            var response;
            const searchType ="pokemon";
            
            response = responsedata.data;
            
            const renderedTemplates = App.templates.renders({
              searchType,
              response,
            });           
            //App.htmlElements.pokemonSprites.style.visibility = "visible";
            App.htmlElements.pokemonSprites.style.display = "block";
            App.htmlElements.pokemonSprites.innerHTML = renderedTemplates;
             
         } catch (error){
            App.htmlElements.pokemonSprites.innerHTML = `<h1>${error}</h1>`;
          }
        } else {
          App.htmlElements.pokemonSprites.style.display = "none";
        }
        if (evolution === true){
          try {
            const url = App.utils.getUrlEvolution({ pokemon });           
            console.log(url);
            
            const {data} = await axios.get(url);
            responsedata = data;
            console.log(responsedata);
            var response;
            const searchType ="pokemon";
            
            response = responsedata.data;
            const renderedTemplate = App.templates.renderEvo({
              searchType,
              response,
            });           
           // App.htmlElements.pokemonEvolution.style.visibility = "visible";
            App.htmlElements.pokemonEvolution.style.display = "block";
            App.htmlElements.pokemonEvolution.innerHTML = renderedTemplate;
             
          } catch (error){
            App.htmlElements.pokemonEvolution.innerHTML = `<h1>${error}</h1>`;
          }
        } else {
          App.htmlElements.pokemonEvolution.style.display = "none";
        }
        if (location === true){
          try {
            const url = App.utils.getUrlLocation({ pokemon });           
            console.log(url);
            
            const {data} = await axios.get(url);
            responsedata = data;
            console.log(responsedata);
            var response;
            const searchType ="pokemon";
            
            response = responsedata.data;
            const renderedTemplate = App.templates.renderLocation({
              searchType,
              response,
            });           
            //App.htmlElements.pokemonLocation.style.visibility = "visible";
            App.htmlElements.pokemonLocation.style.display = "block";
            App.htmlElements.pokemonLocation.innerHTML = renderedTemplate;
             
          } catch (error){
            App.htmlElements.pokemonLocation.innerHTML = `<h1>${error}</h1>`;
          }
        } else {
          App.htmlElements.pokemonLocation.style.display = "none";
        }     

        },
      },
      utils: {
        getUrlPokemon: ({ pokemon }) => {
          return `${App.config.apiBaseUrlPokemon}/${pokemon}`;
        },
        getUrlEvolution: ({ pokemon }) => {
          return `${App.config.apiBaseUrlEvolution}/${pokemon}`;
        },
        getUrlLocation: ({ pokemon }) => {
          return `${App.config.apiBaseUrlLocation}/${pokemon}`;
        },
      },
      templates: {
        render: ({ searchType, response }) => {
          console.log("aqui");
          console.log (response);         
          console.log(response.sprites.other["official-artwork"].front_default);
          const renderMap = {            
            pokemon: App.templates.pokemonCard,
          };
          return renderMap[searchType]
          ? renderMap[searchType](response)
          : App.templates.errorCard();
        },
        renders: ({ searchType, response }) => {
          const renderMaps = {            
            pokemon: App.templates.spritesCard,
          };
          return renderMaps[searchType]
          ? renderMaps[searchType](response)
          : App.templates.errorCard();
        },
        renderEvo: ({ searchType, response }) => {
          let evoChain = [];
      let evoData = response.chain;
      do {
        let numberOfEvolutions = evoData.evolves_to.length;  
        evoChain.push({
          "species_name": evoData .species.name,
        //  "species_url": evoData .species.url,
          "is_baby": !evoData ? 1 : evoData .is_baby          
        });
        if(numberOfEvolutions > 1) {
          for (let i = 1;i < numberOfEvolutions; i++) { 
            evoChain.push({
              "species_name": evoData.evolves_to[i].species.name,
              //"species_url": evoData.evolves_to[i].species.url,
              "is_baby": !evoData.evolves_to[i]? 1 : evoData.evolves_to[i].is_baby
           });
          }
        }        
      
        evoData = evoData.evolves_to[0];
      } while (evoData != undefined && evoData.hasOwnProperty('evolves_to'));
      
      response.evolutionChain = evoChain;
      
          const renderMapEvo = {            
            pokemon: App.templates.evolutionCard,
          };
          return renderMapEvo[searchType]
          ? renderMapEvo[searchType](response)
          : App.templates.errorCard();
        },
        renderLocation: ({ searchType, response }) => {
          console.log("aqui location" );
           console.log (response);         
           let locations = [];
           let locationData = response;
           response.locations = locationData;
           const renderMaps = {            
             pokemon: App.templates.locationCard,
           };
           return renderMaps[searchType]
           ? renderMaps[searchType](response)
           : App.templates.errorCard();
         },
        errorCard: () => `<h1>Invalid Pokemon</h1>`,
        pokemonCard: ({ id, name, weight, height,sprites}) => { 
          const sartwork = `<img src="${sprites.other["official-artwork"].front_default}" alt="" width="50%" height="50%">`;
          return  `<div class="row"><h1>${name} (${id})</h1></div>
          <div class="row">
          <div class="col-sm-6 text-right" >
              ${sartwork}
              <label   for="">Weight/Height</label>
                  <li>${weight}/${height} </li>
          </div>
        </div>`;
        },  
        spritesCard: ({ sprites}) => { 
          const sbackshiny = `<img src="${sprites.back_shiny}" alt="">`;
          const sback = `<img src="${sprites.back_default}" alt="">`;
          const sfront = `<img src="${sprites.front_default}" alt="" >`;
          const sfrontshiny = `<img src="${sprites.front_shiny}" alt="" >`;
          
          
          return  `<div class="col-sm-10"> 
                <label   for="">Sprites</label>	      
                   <div class="smallImages">
                       <div class="rows">
                          <div>
                              ${sback}
                              ${sbackshiny}
                              ${sfront}   
                              ${sfrontshiny}                
                           </div>                 
                        </div>
                  </div>
                  </div>`;
        },
        evolutionCard: ({  evolutionChain }) => {          
          const evoChainList = evolutionChain.map(
            ({species_name,is_baby}) =>
            `<li>${species_name}${
             is_baby ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M13.2934 6.25109C12.9241 5.38371 12.3475 4.62026 11.6142 4.02774C10.881 3.43522 10.0135 3.03176 9.08788 2.85278L9.924 1.515L9.076 0.985001L7.97272 2.75025C6.8489 2.75546 5.75123 3.08981 4.81533 3.71198C3.87943 4.33415 3.14632 5.21687 2.70656 6.25109C2.11752 6.26229 1.55638 6.50415 1.14377 6.92468C0.731151 7.34522 0.5 7.91085 0.5 8.5C0.5 9.08915 0.731151 9.65479 1.14377 10.0753C1.55638 10.4959 2.11752 10.7377 2.70656 10.7489C3.14819 11.7874 3.88552 12.673 4.82675 13.2955C5.76798 13.9181 6.87153 14.25 8 14.25C9.12848 14.25 10.232 13.9181 11.1733 13.2955C12.1145 12.673 12.8518 11.7874 13.2934 10.7489C13.8825 10.7377 14.4436 10.4959 14.8562 10.0753C15.2689 9.65479 15.5 9.08915 15.5 8.5C15.5 7.91085 15.2689 7.34522 14.8562 6.92468C14.4436 6.50415 13.8825 6.26229 13.2934 6.25109ZM14.1419 9.37531C13.9132 9.60923 13.6015 9.74353 13.2744 9.74909L12.6268 9.76141L12.3733 10.3575C12.0085 11.2155 11.3993 11.9472 10.6217 12.4616C9.84411 12.976 8.93236 13.2503 8.00002 13.2503C7.06767 13.2503 6.15593 12.976 5.37831 12.4616C4.6007 11.9472 3.99157 11.2155 3.62678 10.3575L3.37322 9.76141L2.72556 9.74909C2.39833 9.74297 2.08657 9.60868 1.85732 9.37509C1.62806 9.14151 1.49963 8.82729 1.49963 8.5C1.49963 8.17271 1.62806 7.85849 1.85732 7.62491C2.08657 7.39132 2.39833 7.25703 2.72556 7.25091L3.37322 7.23859L3.62678 6.64253C3.99158 5.78452 4.60071 5.05278 5.37832 4.53842C6.15594 4.02405 7.06768 3.7498 8.00002 3.7498C8.93235 3.7498 9.8441 4.02405 10.6217 4.53842C11.3993 5.05278 12.0085 5.78452 12.3733 6.64253L12.6268 7.23859L13.2744 7.25091C13.5185 7.25552 13.7559 7.33154 13.9572 7.46958C14.1585 7.60762 14.315 7.80163 14.4073 8.02762C14.4996 8.25362 14.5236 8.5017 14.4765 8.74122C14.4293 8.98073 14.313 9.20118 14.1419 9.37531Z" fill="black"/>
             <path d="M5.25 7.25H6.5V8.5H5.25V7.25ZM9.5 7.25H10.75V8.5H9.5V7.25ZM8 12C8.3283 12 8.65339 11.9353 8.95671 11.8097C9.26002 11.6841 9.53562 11.4999 9.76777 11.2678C9.99991 11.0356 10.1841 10.76 10.3097 10.4567C10.4353 10.1534 10.5 9.8283 10.5 9.5H5.5C5.5 9.8283 5.56466 10.1534 5.6903 10.4567C5.81594 10.76 6.00009 11.0356 6.23223 11.2678C6.70107 11.7366 7.33696 12 8 12Z" fill="black"/>
             </svg>`:""
           }</a></li>`
           ) ;      

           return `<div class="row">          
           <div class="col-sm-6"> 
             <label   for="">Evolution chain</label>
             <ul>${evoChainList.join("")}</ul>
           </div>                      
         </div>`;
        },
        locationCard: ({  locations }) => { 
          //const location = `<li>Locations</li>`;
          let numberLocations = locations.length;
           
          console.log(numberLocations);
          let location = `<div class="container-sm">
                          <div class="row header" style="text-align:center;color:green">
                          <h3>Ubicación</h3>
                          </div>
                          <div class="table-responsive">
                          <table id = "tblLocations" class = "table table-bordered table-hover" >`;
          location += `<thead class="thead-dark">
                            <tr>
                              <th scope="col">Version</th>
                              <th scope="col">Chance</th>
                              <th scope="col">Max Level</th>
                              <th scope="col">Min Level</th>
                              <th scope="col">Method</th>
                            </tr>
                       </thead>`
          for (let i = 0; i < numberLocations; i++) {
            location += `<tbody> <tr> <td style="font-weight:bold">  ${locations[i].location_area.name }</td>
                                      <td> </td>  
                                      <td> </td>  
                                      <td> </td> 
                                      <td> </td> 
                                  </tr>`;
            let numberVersion_details = locations[i].version_details.length;
            for (let j = 0; j < numberVersion_details; j++) {
                location += `<tr> <td>  ${locations[i].version_details[j].version.name}</td>
                <td>${locations[i].version_details[j].max_chance} </td> 
                <td> </td>  
                <td> </td> 
                <td> </td> 
            </tr>`;
            let numberEncounter_details = locations[i].version_details[j].encounter_details.length;
            for (let k = 0; k < numberEncounter_details; k++) {
              location += `<tr>
              <td> </td>
              <td>${locations[i].version_details[j].encounter_details[k].chance}  </td> 
              <td>${locations[i].version_details[j].encounter_details[k].max_level} </td> 
              <td>${locations[i].version_details[j].encounter_details[k].min_level} </td>  
              <td> ${locations[i].version_details[j].encounter_details[k].method.name}</td>                
          </tr>`;
            }
            }
          }
          location += `</tbody> </table></div></div>`;
          console.log(location);
          return location;
         }
      },
    };
    App.init();
  })();