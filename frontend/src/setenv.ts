// This file exists because the environment files are static. Thus we need a file which will
// generate the environment files for us during compilation.

const { writeFile } = require('fs');
const { argv } = require('yargs');
const { join } = require('path')

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Read env variables
const myEnv = dotenv.config({ path: join(__dirname, '../../.env') });
// Variable expansion (since some variables reference other variables)
dotenvExpand.expand(myEnv);

// Read cmd line arguments
const environment = argv.environment;
const isProduction = environment === 'prod';

if (!process.env["API_URL"] || !process.env["PROD_API_URL"]) {
    console.error('Not all the required environment variables were provided!');
    process.exit(-1);
 }

// Which file to write
const targetPath = './src/environments/environment.ts';

// Content to fill environment files with.
const environmentFileContent = 
`export const environment = {
   production: ${isProduction},
   apiURL: "${isProduction ? process.env["PROD_API_URL"] : process.env["API_URL"]}"
};`;

writeFile(targetPath, environmentFileContent, function (err: any) {
    if (err) {
       console.log(err);
    } else {
      console.log('Wrote variables to ${targetPath}');
    }
 });