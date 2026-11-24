// Render at build time. Readers need no formula JavaScript or network CDN.
const fs=require('node:fs'),katex=require('katex');
const input=JSON.parse(fs.readFileSync(0,'utf8'));
process.stdout.write(JSON.stringify(input.map(tex=>katex.renderToString(tex,{displayMode:true,throwOnError:true,strict:'error',output:'htmlAndMathml',trust:false}))));
