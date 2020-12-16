import {message, danger} from 'danger';
import * as parser from 'fast-xml-parser';
import * as fs from 'fs';


function loadLatestDetektXml() {
  const data= fs.readFileSync('./build/detekt/detekt.xml').toString();

  const options: parser.X2jOptionsOptional = {
    attrNodeName: "attr"
  };
  const obj = parser.parse(data, options)
  console.log(obj)
}

loadLatestDetektXml()
const modifiedMD = danger.git.modified_files.join("- ")
message("Changed Files in this PR: \n - " + modifiedMD)
