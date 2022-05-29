const axios = require('axios').default;

const main = async (n) => { 
    var fibonacci = [];
    fibonacci[0] = 0;
    fibonacci[1] = 1;
    for (var i = 2; i < n; i++) {
        fibonacci[i] = fibonacci[i - 2] + fibonacci[i - 1];
    }
    console.log( fibonacci);
 
} ;

main(10);