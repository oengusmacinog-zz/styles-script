// Sandbox
let { parse, stringify } = require('scss-parser');
let createQueryWrapper = require('query-ast');
let prettier = require('prettier');
let utils = require('./utils');

function getSelectors(rules) {

    let i = 0;

    for(let rule of rules) {
        let matchIndex = i-1;
        let selArray = [];

        if( i == 0) {

            // Can't look back from first element
            i++;
            continue;

        } else {

            // Look backward till no match is found
            while(rule.code.includes(rules[matchIndex].code)) {

                // Add Selector id to array
                selArray.push(rules[matchIndex].id);

                // Iterate backwards till beginning
                // of array
                if (matchIndex > 1) {
                    matchIndex--;
                } else {
                    break;
                }

            }

            rule.selectors = selArray;

        }
        i++;
    }

    return rules;
}

function writeProps(filename) {
    // This will write out the props list
}

function convert(filename) {

    let rules = [];
    let rawScss,
        output = '';

    if (filename) {
        const fs = require('fs');

        rawScss = utils.readFromFile(filename);
        // console.log(rawScss);
    } else {
        console.log(`Please provide a filename to convert`);
    }
    // Create an AST
    let ast = parse(rawScss);

    // Create a function to traverse/modify the AST
    let $ = createQueryWrapper(ast);

    // Get the rule count for the input file
    // including nested rules
    let ruleCount = $('rule').length();
    // console.log(`ruleCount is ${ruleCount}`);


    for (i = 0; i < ruleCount; i++) {
        // turn rule into string
        let s = {
            "id": i,
            "code": stringify($('rule').get(i)),
            "selectors": []
        };
        rules.push(s);

    }

    // console.log(rules);
    // return;

    rules = getSelectors(rules);

    // console.log(rules);
    utils.writeToFile('./out.json', prettier.format(JSON.stringify(rules)));

}

function main() {

    // console.log(process.argv);
    const command = process.argv[2];
    const target = process.argv[3];


    if ( command === 'convert' ) {
        convert(target);
    } else if ( command === 'write-props' ) {
        writeProps(target);
    } else {
        console.log(`\nPlease Enter a Valid Command:\n\tconvert - convert a scss file to mergestyls\n\twrite-props - write props list\n`)
    }

}

main();
