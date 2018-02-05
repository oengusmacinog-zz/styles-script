// Sandbox
let { parse, stringify } = require('scss-parser');
let createQueryWrapper = require('query-ast');
let prettier = require('prettier');
let utils = require('./utils');

function getSelectors(rules) {
    let prevCode = '';

    rules.forEach(function(rule, i){
        let matchIndex = i-1;
        let selArray = [];

        // console.log(rule.code);

        if( i == 0) {
            prevCode = rule.code;
        // } else if (rule.code.includes(prevCode)) {
            // console.log(`hello ${i}`);

        } else {

            prevCode = rule.code;

            while(rule.code.includes(rules[matchIndex].code)) {
                // console.log(matchIndex);
                // console.log(`rules[matchIndex].code => ${rules[matchIndex].code}`);

                // console.log(`prevCode => ${prevCode}`);
                let sel = {
                    code: rules[matchIndex].code,
                    selectors: []
                };

                // Remove selector rule from parent code element
                // let re = new RegExp(`${rules[matchIndex].code}`,"g");

                preRe = utils.cleanForRegex(rules[matchIndex].code);
                let re = new RegExp(preRe,"g");
                rule.code = rule.code.replace(re, '');

                //Add Selector to array
                selArray.push(sel);

                // Remove selector as a parent rule
                rules.splice(matchIndex, 1);


                if (matchIndex > 1) {
                    matchIndex--;
                } else {
                    break;
                }

            }

            // // If selectors exist check if they have selecters
            // if ( selArray.length > 0 ){
            //     getSelectors(selArray);
            // }

            // prevCode = rule.code;
            // console.log(`rules[matchIndex].code => ${rules[matchIndex].code}`);

            // console.log(`prevCode => ${prevCode}`);

            rule.selectors = selArray;
            // rule.code = utils.cleanUpNewlines(rule.code);
            // not working...

        }
    });

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
            code: stringify($('rule').get(i)),
            selectors: []
        };
        rules.push(s);

    }

    // console.log(rules);

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
