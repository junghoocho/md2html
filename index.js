const katexOptions = {
    output: "html",             
    macros: {
        "\\frag": "\\htmlClass{fragment}",
        "\\fragIdx": '\\htmlAttr{class=fragment, data-fragment-index=#1}{#2}',
    },
    trust: true,
    strict: false
};
const markdownItOptions = {
    html: true, 
    typographer: true,
};


// get command line parameters
const argv = require('minimist')(process.argv.slice(2));
if (argv['h']) {
    console.log("Usage: md2html [-n] [-s name=value] [-t template_file] [-i input_file] [-o output_file]");
    console.log("  Convert markdown into reveal.js HTML slides");
    console.log("Options:");
    console.log("  -n: Generate notes not slides");
    console.log("  -s name=value: Substitute {{name}} with value")
    console.log("  -t template_file: HTML template file to use");
    console.log("  -i input_file: Markdown input file (default: stdin)");
    console.log("  -o output_file: HTML output file (default: stdout)");
    process.exit(1);
}

let input_file = argv['i'];
let template_file = argv['t'];

// setup markdown parser
const MarkdownIt = require('markdown-it');
const mdParser = new MarkdownIt(markdownItOptions);
mdParser.use(require('markdown-it-attrs'));
if (argv['n']) { // syntax highlight for notes
    mdParser.use(require('markdown-it-highlightjs'));
}
mdParser.use(require('./markdown-it-email'));
mdParser.use(require('./markdown-it-katex'), katexOptions);

function renderSlide(markdown)
{
    let cls = (markdown.match(/(^|\n)# [^\n]*\n[ \t]*\n/)) ? ' class="title-slide"': '';
    return `<section${cls}>${mdParser.render(markdown)}</section>`;
}

function renderNote(markdown)
{
    return mdParser.render(markdown);
}

const fs = require('fs');

// read markdown input
try {
    var markdown = fs.readFileSync(input_file ? input_file : process.stdin.fd, 'utf8');
} catch (err) {
    console.error(err);
    process.exit(1);
}

// read HTML template
try {
    var html = fs.readFileSync(template_file, 'utf8');
} catch (err) {
    html = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <title>TITLE</title>
        <link rel="stylesheet" href="/libs/css/highlight-theme/atom-one-light.css" id="highlight-theme">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css" integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc" crossorigin="anonymous">
    </head>
    <body>
<!-- MARKDOWN_NOTES -->
<!-- MARKDOWN_SLIDES -->
    </body>
</html>`;
}

// perform variable substitution in the markdown input
if (argv['s']) {
    let regex = /([a-zA-Z][a-zA-Z0-9_\-]*)=(.*)/;
    substitutions = (argv['s'] instanceof Array) ? argv['s'] : [ argv['s'] ];
    for (let substitution of substitutions) {
        let match = regex.exec(substitution);
        if (match !== null) {
            markdown = markdown.replaceAll(`{{${match[1]}}}`, match[2]);
        }
    }
}

let output = "";
if (argv['n']) {
    // insert rendered notes to the HTML template
    output = html.replace('<!-- MARKDOWN_NOTES -->', renderNote(markdown));
} else {
    //
    // we need to do a bit more for slides than notes
    //

    // update the name of the annotation json file
    let jsonFilename = "";
    if (input_file) {
        jsonFilename = input_file.replace(/^.*[\\\/]/, '').replace(/\.[^\.]*$/, '') + ".json";
    }
    output = html.replace('__SLIDES-JSON__.json', jsonFilename);

    // split markdown into individual slides and render them to HTML
    let frags = markdown.split(/\n\s*\n(##[^\n]*\n[ \t]*\n)/)
    let slides = []
    if (frags.length > 0) {
        slides.push(renderSlide(frags[0]))
        for (let i = 1; i < frags.length - 1; i += 2) {
            slides.push(renderSlide(frags[i]+frags[i+1]));
        }
    }

    // insert rendered slides to the output
    output = output.replace('<!-- MARKDOWN_SLIDES -->', slides.join('\n'));
}

// replace HTML title with the content of <h1> 
let match = /<h1[^>]*>(.*)<\/h1>/.exec(output);
if (match) {
    output = output.replace('<title>TITLE</title>', `<title>${match[1]}</title>`);
}

// produce output
if (argv['o']) {
    try {
        fs.writeFileSync(argv['o'], output);
    } catch (err) {
        console.error(err)
    }
} else {
    console.log(output);
}
