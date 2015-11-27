Reads and sends climate data from tessel to firebase.

## Usage

Setup firebase project name in `config.js`

### Run code on tessel

`tessel run src/index.js --upload-dir ./log [INTERVAL] [PATH]`

or use sortcut with test `interval` and `path`:
`npm run-script run`

### Deploy code to tessel
`tessel push src/index.js --args [INTERVAL] [PATH]`

or use sortcut with test `interval` and path:
`npm run-script deploy`

- `INTERVAL` => Time between measurements in miliseconds. (1000 -> ~1sec)
- `PATH` => Firebase path to send the data to under your project.

It's possible to set `interval` and `path` to be able to conduct measurements with multiple tessels.

For example: one tessel in the kitchen and one tessl in the bedroom with updates in every hours.
 - Tessel1: `tessel push src/index.js --args ./log 3600000 /bedroom`
 - Tessel2: `tessel push src/index.js --args ./log 3600000 /kitchen`

## Status LEDs

 - **green** => idle, waiting for next operation
 - **blue**
     + *light* => measuring temperature and humidity
     + *blinking* => sending data to firebase.io
 - **red**
     + *light* => there was an error somewhere
     + *blinking* => climate sensor failed to boot
