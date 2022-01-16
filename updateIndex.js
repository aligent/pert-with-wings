const fs = require('fs')
const replace = require('replace-in-file')

fs.readFile('pert-bookmarklet.js', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const options = {
        files: 'index.html',
        from: /javascript.*\(\)/,
        to: data.toString(),
    };

    replace(options)
        .then(results => {
            console.log('Replacement results:', results);
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
})
