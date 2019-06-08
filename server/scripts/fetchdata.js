/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const monk = require('monk');
const path = require('path');

const CardImport = require('./fetchdata/CardImport.js');
const DefaultWebImageSource = require('./fetchdata/DefaultWebImageSource.js');
const JsonCardSource = require('./fetchdata/JsonCardSource.js');
const NoImageSource = require('./fetchdata/NoImageSource.js');

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    { name: 'card-dir', type: String, defaultValue: path.join(__dirname, '..', '..', 'ringsteki-json-data') },
    { name: 'image-source', type: String, defaultValue: 'default' },
    { name: 'image-dir', type: String, defaultValue: path.join(__dirname, '..', 'public', 'img', 'cards') },
    { name: 'no-images', type: Boolean, defaultValue: true }
];

function createDataSource(options) {
    switch(options['card-source']) {
        case 'json':
            return new JsonCardSource(options['card-dir']);
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

function createImageSource(options) {
    if(options['no-images']) {
        return new NoImageSource();
    }

    switch(options['image-source']) {
        case 'none':
            return new NoImageSource();
        case 'default':
            return new DefaultWebImageSource();
    }

    throw new Error(`Unknown image source '${options['image-source']}'`);
}

let options = commandLineArgs(optionsDefinition);

let db = monk(process.env.RINGSTEKI_DBPATH || 'mongodb://mongo:27017/ringsteki');
let dataSource = createDataSource(options);
let imageSource = createImageSource(options);
let cardImport = new CardImport(db, dataSource, imageSource, options['image-dir']);

cardImport.import();

