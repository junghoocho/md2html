# md2html

## Overview

Converts markdown input into reveal.js HTML slides

## Usage

```
md2html [-n] [-t template_file] [-i input_file] [-o output_file]
  Convert markdown into reveal.js HTML slides

Options:
  -n: Generate notes not slides
  -t template_file: HTML template file to use
  -i input_file: Markdown input file (default: stdin)
  -o output_file: HTML output file (default: stdout)
```

## Building md2html

You can produce the `build/md2html.js` file by simply executing `webpack` in the project directory. Once the file is created, you can make it an executable file by adding `#!/usr/bin/env node` at the beginning of the file and setting its executable bit. Rename it into `md2html`.

## Explanation of JavaScript Files

Project root directory contains the following four JavaScript files:

1.  `index.js`: This is the main md2html code
2.  `katex.js`: This is a slightly modified version of `KaTeX` version 0.13.11, so that it supports `\htmlAttr` command
3.  `markdown-it-katex.js`: This is [@iktakahiro's markdown-it-katex](https://github.com/iktakahiro/markdown-it-katex), except that I changed it to use my custom KaTeX package, not the original one.
4.  `markdown-it-email.js`: This is an email obfuscation code for markdown-it obtained from [markdown-it-email-obfuscator](https://github.com/ilyaigpetrov/markdown-it-email-obfuscator) with minor modification. It seems the project has been abandoned and is no longer maintained.

## License

Uses MIT licensed code from [Connect](https://github.com/senchalabs/connect/) and  [Roots](https://github.com/jenius/roots).

(MIT License)

Copyright (c) 2021 Junghoo Cho

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
