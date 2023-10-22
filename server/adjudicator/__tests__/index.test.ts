import { Territory } from '../../models/Territory';
import { Order } from '../../models/Order';
import territoriesRaw from '../../data/territories.json';
import { Adjudicator } from '..';

const territories = territoriesRaw.map((t) => new Territory(t.id, t.type, t.supply_center ? 1 : 0, t.neighbors, t.fleet_restrictions, t.country));

describe('Adjudicator', () => {
    it('hold simple succeeds', () => {
        const orders = [new Order("Russia", "A", "MOS", "H", "MOS", "", "", "", "")];
        new Adjudicator(territories, orders);

        expect(orders[0].getResolution()).toBe('succeeds');
    });

    it('direct army simple succeeds', () => {
        const orders = [new Order("Russia", "A", "MOS", "M", "UKR", "", "", "", "")];
        new Adjudicator(territories, orders);

        expect(orders[0].getResolution()).toBe('succeeds');
    });

    it('indirect no convoy fails', () => {
        const orders = [new Order("Russia", "A", "MOS", "M", "BOH", "", "", "", "")];
        new Adjudicator(territories, orders);

        expect(orders[0].getResolution()).toBe('fails');
    });
});
