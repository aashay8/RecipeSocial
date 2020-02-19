var fetch = require('node-fetch');
setTimeout(()=>console.log('outside promise'), 0);
new Promise((resolve, reject) => {
    console.log('inside promise');
    // return fetch('https://www.themealdb.com/api/json/v1/1/categories.php', function(err, data){
    //     if(err) return console.log(err);
    //     console.log('fetched data===================>', data);
    //     resolve(data);
    // });
});
