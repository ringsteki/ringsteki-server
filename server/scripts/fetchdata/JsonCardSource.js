/*eslint no-console:0 */
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

class JsonCardSource {
    constructor(directory) {
        console.log('Loading pack files...');
        let data = this.loadPackFiles(directory);
        console.log('\tdone.')
        this.packs = data.packs;
        this.cards = data.cards;
    }

    loadPackFiles(directory) {
        let packs = [];
        let cards = [];
        let files = fs.readdirSync(path.join(directory, 'packs'));
        for(let file of files) {
            let pack = JSON.parse(fs.readFileSync(path.join(directory, 'packs', file)));

            for(let card of pack.cards) {
                card.packName = pack.Name;
            }

            cards = cards.concat(pack.cards);
            delete pack.cards;
            packs.push(pack);
        }

        // this.addLabelToCards(cards);

        return {
            cards: cards,
            packs: packs
        };
    }

    // addLabelToCards(cards) {
    //     for(let card of cards) {
    //         let cardsByName = _.filter(cards, filterCard => {
    //             return filterCard.name === card.name;
    //         });

    //         if(cardsByName.length > 1) {
    //             card.label = card.name + ' (' + card.packCode + ')';
    //         } else {
    //             card.label = card.name;
    //         }
    //     }
    // }

    getCards() {
        return this.cards;
    }

    getPacks() {
        return this.packs;
    }
}

module.exports = JsonCardSource;
