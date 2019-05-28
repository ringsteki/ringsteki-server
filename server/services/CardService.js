const logger = require('../log.js');

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({})
            .then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({})
            .then(() => this.packs.insert(cards));
    }

    getAllCards() {
        return this.cards.find({})
            .then(result => {
                let cards = {};

                for(let card of result) {
                    cards[card.Title] = card;
                }

                return cards;
            }).catch(err => {
                logger.info(err);
            });
    }

    getTitleCards() {
        return this.cards.find({ type: 'title' })
            .then(cards => {
                return cards.reduce((memo, card) => {
                    memo[card.code] = card;
                    return memo;
                }, {});
            });
    }

    getAllPacks() {
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }

    async getRestrictedList() {
        // eslint-disable-next-line no-console
        console.warn('called getRestrictedList, but this doesn\'t return any data for this project');
        return Promise.resolve([]);
    }
}

module.exports = CardService;

