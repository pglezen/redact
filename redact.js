// Redact file contents using a rule file of the form
//
// [ 
//  { startingAt:  3, replaceWith: "WXYZ" },
//  { startingAt: 15, replaceWith: "QRS", padding: 7 }
// ]
//
// Means:
//    - starting at column 4, overwrite contents with "WXYZ"
//    - starting at column 16, overwrite contents with "QRS    "
//    - If line is not long enough, truncate replacement
//      (preserve length of each line).
//    - The optional padding attribute means pad to the right
//      with spaces until the string length is the size indicated
//      (according to String.prototype.padEnd()).
// 
// Invoke as 
//
//      node redact.js myRules.json myFile.txt > redactedFile.txt
//
const fs = require('fs');
const readline = require('readline');


let rules = [
  { startingAt:  3, replaceWith: "WXYZ" },
  { startingAt: 15, replaceWith: "QRS", padding: 7 }
];

const processStream = rl => {
  rl.on('error', err => {
    console.error(`File error: ${err.path}`);
  });

  rl.on('line', (currentLine) => {
    let line = currentLine;
    rules.forEach((rule, ruleIndex) => {
      let offset = rule['startingAt'];
      let replacement = rule['replaceWith'];
      let padding = rule['padding'];
      padding = isNaN(padding) ? 0 : parseInt(padding);
      if (padding) {
        replacement = replacement.padEnd(padding);
      }

      // Don't write past the end of line.
      if (offset < line.length) {
        if (offset + replacement.length > line.length) {
          replacement = replacement.slice(0, 
                        offset + replacement.length - line.length);
        }
        let segments = [line.slice(0, offset),
                        replacement,
                        line.slice(offset + replacement.length)];
        line = segments.join('');
      } else {
        console.error(`Offset ${ruleIndex+1} is ${offset}, but line length is ${line.length}.`);
        console.error(`Rule ${ruleIndex+1} not applied to [${line}].`);
      }
    });
    console.log(line)
  });

  rl.on('close', () => {
    console.error('Done.');
  });
}

if (process.argv.length > 2) {
  let ruleFilename = process.argv[2];

  let rulesStr = fs.readFileSync(ruleFilename, { encoding: 'utf8'});
  rules = JSON.parse(rulesStr);
  if (process.argv.length > 3) {
    let inFilename = process.argv[3];
    console.error(`About to process ${inFilename}.`);
    let inFileStream = fs.createReadStream(inFilename, 'utf8');
    inFileStream.on('error', err => {
      console.error(`Error attempting to process input file ${err.path}.`);
    });
    let readlineOptions = { input: inFileStream };
    let rl = readline.createInterface(readlineOptions);
    processStream(rl);
  } else {
    rl = readline.createInterface({ input: process.stdin });
    processStream(rl);
  }
} else {
  console.error(`Rules must be specified.`);
  console.error(`Usage: ${process.argv[1]} <rule file> [<input file>]`);
  console.error(`       If <input file> is absent, stdin is used.`);
}

