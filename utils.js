module.exports = {
    readFromFile: function (filename) {
        const fs = require('fs');
        return fs.readFileSync(filename, 'utf8');
    },
    writeToFile: function (filename, contents) {
        const fs = require('fs');
        fs.writeFile(filename, contents, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    },
    cleanForRegex(s) {
        let re = `\*`;
        return s.replace(re, '\\*');
    },
    // cleanUpNewlines(s) {
    //     let re = `\s+\\n`;
    //     return s.replace(re, '');
    // } Not working...
};