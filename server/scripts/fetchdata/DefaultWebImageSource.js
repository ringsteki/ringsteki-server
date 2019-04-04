/*eslint no-console:0 */
const fs = require('fs');
const jimp = require('jimp');
const request = require('request');
const axios = require('axios');

class CardgameDbImageSource {
    constructor() {
        // this.packs = this.loadPacks();
    }

    loadPacks() {
        let files = fs.readdirSync('ringsteki-json-data/packs');
        return files.map(file => JSON.parse(fs.readFileSync('ringsteki-json-data/packs/' + file)));
    }

    /**
     * @param {Object.<string, any>} card
     * @param {string} imagePath 
     */
    async fetchImage(card, imagePath) {
        if (!card.Front || !card.Front.ImagePath) {
            console.log(`Card ${card.Title} did not have a Front.ImagePath`);
            return;
        }

        let url = encodeURI(card.Front.ImagePath);

        const writer = fs.createWriteStream(imagePath)

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
          });

          response.data.pipe(writer);

          return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          });

        // request({ url: url, encoding: null }, function(err, response, body) {
        //     if(err) {
        //         console.log(`Unable to fetch image for ${card.Title} from ${url}: ERROR ${err}`);
        //         return;
        //     } else if (response.statusCode !== 200) {
        //         console.log(`Unable to fetch image for ${card.Title} from ${url}: ${response.statusCode} - ${response.statusMessage}`);
        //         return;
        //     }

        //     console.log('Downloading image for ' + card.Title);
        //     jimp.read(body).then(lenna => {
        //         console.log('saving');
        //         lenna.write(imagePath);
        //     }).catch(err => {
        //         console.log(`Error converting image for ${card.Title}: ${err}`);
        //     });
        // });
    }
}

module.exports = CardgameDbImageSource;
