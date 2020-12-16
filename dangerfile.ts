import {message, danger} from 'danger';
import * as parser from 'fast-xml-parser';
import * as fs from 'fs';

// type definitions

interface DetektReport {
  checkstyle: Checkstyle[];
}

interface Checkstyle{
  file: DetektReportFile[];
}

interface DetektReportFile {
  __name: string;
  error: DetektError[];
}

interface DetektError {
  __line: string;
  __column: string;
  __severity: string;
  __message: string;
  __source: string;
}

const SEVERITY = {
  WARNING: "warning",
  MAINTENABILITY:  'maintenability',
  DEFECT: "defect",
  CODE_SMELL: "codesmell",
  MINOR: "minor",
  STYLE: 'style',
  PERFORMANCE: 'performance',
};

function loadLatestDetektXml(): DetektReport {
  const data = fs.readFileSync('./build/reports/detekt.xml').toString();

  const options: parser.X2jOptionsOptional = {
    attributeNamePrefix: "__",
    ignoreAttributes: false,
    arrayMode: true
  };
  return parser.parse(data, options)
}

const report = loadLatestDetektXml();

const severityCounts: {[key: string]: number} = {};

for (const file of report.checkstyle[0].file) {
  for (const error of file.error) {
    const count = severityCounts[error.__severity.toLowerCase()] || 0;

    severityCounts[error.__severity.toLowerCase()] = count + 1;
  }
}


const counts: string[] = Object.entries(SEVERITY).reduce((value, [k,v]) => {
  const count = severityCounts[v] || 0;

  return value.concat(`- \`${k} --> ${count}\``);
}, []);

message("Results of analysis by detekt are...: \n" + counts.join("\n"))
