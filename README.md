Revenue Recognition Report Formatter

A little NodeJS app that takes an invoice report and formats it so it can be pivoted as a monthly revenue recognition report.


## Set up and execution

1. Install NodeJS on your machine
2. Clone this repository
3. Run `npm install` to install dependencies
4. Run `node index.js` to execute the script

## Input

The input file must be a CSV named `data.csv` and live in the project root directory.  There required fields can be found in `sample_data.csv`.

## Output

On success, the output file will be named `output.csv`