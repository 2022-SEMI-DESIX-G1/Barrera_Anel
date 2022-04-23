function calcular(){
  reset();
var fibonacci = [];
fibonacci[0] = 0;
fibonacci[1] = 1;
const num = document.getElementById("num").value;
 
for (var i = 2; i < num; i++) {
  fibonacci[i] = fibonacci[i - 2] + fibonacci[i - 1];
}
console.log(fibonacci);

const container = document.getElementById('container');
fibonacci.forEach(function(valor, indice, array) {
  let card = document.createElement("div");
  let div = document.createElement("div");
  card.className = 'card';
  card.id = valor;
  card.style = 'float:left'; 
  div.className = 'container';
  let name = document.createTextNode(valor );
div.appendChild(name);
  card.appendChild(div);
  let container = document.querySelector("#container");
  container.appendChild(card);
   
  card.addEventListener('click', function(event) {
    console.log( event.target.id );
    eliminar(this.id);
});
});
}

function eliminar(id){  
	elemento = document.getElementById(id);	
	if (!elemento){
		alert("El elemento selecionado no existe");
	} else {
    if (confirm("¿Está seguro que desea eliminar el elemento: " + id + " ?")){
      padre = elemento.parentNode;
		  padre.removeChild(elemento);
    }

	}
}

function reset(){
  const elements = document.getElementsByClassName("container");
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
   
}
 