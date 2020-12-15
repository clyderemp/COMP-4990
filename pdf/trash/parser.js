const fs = require('fs')
const pdfparse = require('pdf-parse')

const pdffile = fs.readFileSync('transcript2.pdf')


//get info

pdfparse(pdffile).then(function (data){
    console.log(data.numpages)

    console.log(data.text)

    //extracts file and output it
    fs.writeFile('out.txt', data.text, (err) => {
        if (err) throw err; 
    })
})