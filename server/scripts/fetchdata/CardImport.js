/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../../services/CardService.js');

class CardImport {
    constructor(db, dataSource, imageSource, imageDir) {
        this.db = db;
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.cardService = new CardService(db);
    }

    async import() {
        try {
            await Promise.all([this.importCards(), this.importPacks()]);
        } catch(e) {
            console.log('Unable to fetch data', e);
        } finally {
            this.db.close();
        }
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        await this.cardService.replaceCards(cards);

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    async fetchImages(cards) {
        mkdirp(this.imageDir);

        let i = 0;

        // console.log(cards.filter(card => card.Title === "Mugash"));

        for(let card of cards) {
            // console.log(`card # ${++i}`);
            let imagePath = path.join(this.imageDir, card.Title + '-' + card.packName + '-' + card.Number + '.png');

            if(!fs.existsSync(imagePath)) {
                // console.log(`need to download ${imagePath}`)
                
                await this.imageSource.fetchImage(card, imagePath);
                
            }
        }
    }

    async importPacks() {
        let packs = await this.dataSource.getPacks();

        await this.cardService.replacePacks(packs);

        console.info(packs.length + ' packs fetched');
    }
}

module.exports = CardImport;
