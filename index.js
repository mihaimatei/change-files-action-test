// const core = require('@actions/core');
// const github = require('@actions/github');
//
// try {
//   // `url` input defined in action metadata file
//   const nameToGreet = core.getInput('url');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

const core = require('@actions/core');
const glob = require('@actions/glob');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const url = (core.getInput('url') === '') ? "my-undefined-url.com" : core.getInput('url');

    let htmlGlob = '**/*.liquid';

    if (htmlGlob) {
      const globber = await glob.create(htmlGlob);
      const globberFiles = await globber.glob();
      console.log(`Glob matched ${globberFiles.length} files`);
      globberFiles.forEach(filePath => rewriteSingleFile(filePath, url));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function rewriteSingleFile(filePath, url) {
  console.log(`Attempting to rewrite file '${filePath}' for url '${url}'...`);

  const originalText = fs.readFileSync(filePath, 'utf8');

  // rewrite base href
  // var updatedText = originalText
  //     .replace(/<base ([^>]*href=["'])([^'"]*)(["'][^>]*)>/, `<base $1${url}$3>`);

  // rewrite head
  var updatedText = updatedText.replace('</head>', getHeadClientHintMarkup(url));

  if (originalText !== updatedText) {
    fs.writeFileSync(filePath, updatedText);  //+'.out'
    console.log('Update done');
  } else {
    console.log('No changes');
  }
}

function getHeadClientHintMarkup(newCDN) {
  return `<meta http-equiv="delegate-ch" content="sec-ch-width https://${newCDN}; 
                    sec-ch-dpr https://${newCDN};
                    sec-ch-viewport-width https://${newCDN}; 
                    ect https://${newCDN}; 
                    sec-ch-ua-bitness https://${newCDN}; 
                    sec-ch-ua-arch https://${newCDN}; 
                    sec-ch-ua-model https://${newCDN}; 
                    sec-ch-ua-platform https://${newCDN}; 
                    sec-ch-ua-platform-version https://${newCDN}; 
                    sec-ch-ua-full-version https://${newCDN}; 
                    sec-ch-ua-full-version-list https://${newCDN} "></head>`;
}

run();