import { Territory } from '../../models/Territory';
import { Order } from '../../models/Order';
import territoriesRaw from '../../data/territories.json';
import { Adjudicator } from '..';

let territories: Territory[];

describe('Adjudicator', () => {
  beforeEach(() => {
    territories = territoriesRaw.map(
      (t) =>
        new Territory(
          t.id,
          t.type,
          t.supply_center ? 1 : 0,
          t.neighbors,
          t.fleet_restrictions,
          t.country
        )
    );
    territories.forEach((t) => {
      t.setCountry('Russia');
    });
  });

  it('hold simple succeeds', () => {
    const orders = [
      new Order('Russia', 'A', 'MOS', 'H', 'MOS', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
  });

  it('direct army simple succeeds', () => {
    const orders = [
      new Order('Russia', 'A', 'MOS', 'M', 'UKR', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
  });

  it('indirect no convoy fails', () => {
    const orders = [
      new Order('Russia', 'A', 'MOS', 'M', 'BOH', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
  });

  test('direct army to water fails', () => {
    const orders = [
      new Order('Russia', 'A', 'LVN', 'M', 'GOB', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
  });

  test('direct army to coast succeeds', () => {
    const orders = [
      new Order('Russia', 'A', 'LVN', 'M', 'PRU', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
  });

  test('direct fleet simple succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'M', 'GOB', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
  });

  test('direct fleet to coast simple succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'M', 'PRU', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
  });

  test('direct fleet from coast simple succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'PRU', 'M', 'BAL', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
  });

  test('direct fleet to land fails', () => {
    const orders = [
      new Order('Russia', 'F', 'PRU', 'M', 'WAR', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
  });

  test('indirect army simple succeeds', () => {
    const orders = [
      new Order('Russia', 'A', 'PRU', 'M', 'DEN', '', '', '', ''),
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'DEN'),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('indirect army simple succeeds reverse order', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'DEN'),
      new Order('Russia', 'A', 'PRU', 'M', 'DEN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('indirect army two convoys succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'FIN'),
      new Order('Russia', 'F', 'GOB', 'C', 'GOB', 'A', 'M', 'PRU', 'FIN'),
      new Order('Russia', 'A', 'PRU', 'M', 'FIN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
    expect(orders[2].getResolution()).toBe('succeeds');
  });

  test('indirect army wrong convoy fails', () => {
    const orders = [
      new Order('Russia', 'F', 'GOB', 'C', 'GOB', 'A', 'M', 'PRU', 'FIN'),
      new Order('Russia', 'A', 'PRU', 'M', 'FIN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('convoying a fleet fails', () => {
    const orders = [
      new Order('Russia', 'F', 'GOB', 'C', 'GOB', 'F', 'M', 'PRU', 'DEN'),
      new Order('Russia', 'F', 'PRU', 'M', 'DEN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('army convoy fails', () => {
    const orders = [
      new Order('Russia', 'A', 'GOB', 'C', 'GOB', 'A', 'M', 'PRU', 'DEN'),
      new Order('Russia', 'A', 'PRU', 'M', 'DEN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('convoying from coast fails', () => {
    const orders = [
      new Order('Russia', 'F', 'PRU', 'C', 'PRU', 'A', 'M', 'BER', 'LVN'),
      new Order('Russia', 'A', 'BER', 'M', 'LVN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('convoy not matching fails', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'LVN'),
      new Order('Russia', 'A', 'BER', 'M', 'LVN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('simple support succeeds', () => {
    const orders = [
      new Order('Russia', 'A', 'PRU', 'S', 'PRU', 'A', 'H', 'BER', 'BER'),
      new Order('Russia', 'A', 'BER', 'H', 'BER', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('fleet support coast succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'S', 'BAL', 'A', 'H', 'BER', 'BER'),
      new Order('Russia', 'A', 'BER', 'H', 'BER', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('support not adjacent from succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'GOB', 'S', 'GOB', 'A', 'M', 'PRU', 'LVN'),
      new Order('Russia', 'A', 'PRU', 'M', 'LVN', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('support not adjacent to fails', () => {
    const orders = [
      new Order('Russia', 'F', 'KIE', 'S', 'KIE', 'A', 'M', 'BER', 'PRU'),
      new Order('Russia', 'A', 'BER', 'M', 'PRU', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('army support water fails', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'H', 'BAL', '', '', '', ''),
      new Order('Russia', 'A', 'BER', 'S', 'BER', 'F', 'H', 'BAL', 'BAL'),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('support convoy simple succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'SWE'),
      new Order('Russia', 'F', 'GOB', 'S', 'GOB', 'A', 'M', 'PRU', 'SWE'),
      new Order('Russia', 'A', 'PRU', 'M', 'SWE', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
    expect(orders[2].getResolution()).toBe('succeeds');
  });

  test('support convoying fleet simple succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'SWE'),
      new Order('Russia', 'F', 'GOB', 'S', 'GOB', 'F', 'H', 'BAL', 'BAL'),
      new Order('Russia', 'A', 'PRU', 'M', 'SWE', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('succeeds');
    expect(orders[2].getResolution()).toBe('succeeds');
  });

  test('support failed convoy succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'BAL', 'C', 'BAL', 'A', 'M', 'PRU', 'SWE'),
      new Order('Russia', 'F', 'GOB', 'S', 'GOB', 'F', 'H', 'BAL', 'BAL'),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('succeeds');
  });

  test('support failed convoy move succeeds', () => {
    const orders = [
      new Order('Russia', 'F', 'GOB', 'S', 'GOB', 'A', 'M', 'PRU', 'SWE'),
      new Order('Russia', 'A', 'PRU', 'M', 'SWE', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('head to head even both fail', () => {
    const orders = [
      new Order('Russia', 'A', 'BER', 'M', 'PRU', '', '', '', ''),
      new Order('Russia', 'A', 'PRU', 'M', 'BER', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('unit move same territory fails', () => {
    const orders = [
      new Order('Russia', 'A', 'BER', 'M', 'BER', '', '', '', ''),
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
  });

  test('unit move same territory with convoy fails', () => {
    const orders = [
      new Order('England', 'F', 'NTH', 'C', 'NTH', 'A', 'M', 'YOR', 'YOR'),
      new Order('England', 'A', 'YOR', 'M', 'YOR', '', '', '', ''),
      new Order('England', 'A', 'LPL', 'S', 'LPL', 'A', 'M', 'YOR', 'YOR'),
      new Order('Russia', 'F', 'LON', 'M', 'YOR', '', '', '', ''),
      new Order('Russia', 'A', 'WAL', 'S', 'WAL', 'F', 'M', 'LON', 'YOR'),
    ];

    let ts = territories.filter((t) =>
      ['NTH', 'YOR', 'LPL'].includes(t.getId())
    );
    ts.forEach((t) => t.setCountry('England'));

    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
    expect(orders[2].getResolution()).toBe('fails');
    expect(orders[3].getResolution()).toBe('succeeds');
    expect(orders[4].getResolution()).toBe('succeeds');
  });

  test('order other country fails', () => {
    const orders = [
      new Order('England', 'F', 'LON', 'M', 'NTH', '', '', '', ''),
      new Order('England', 'F', 'ENG', 'H', 'ENG', '', '', '', ''),
    ];

    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
  });

  test('fleet must follow coast fails', () => {
    const orders = [
        new Order("Russia", "F", "ROM", "M", "VEN", "", "", "", "")
    ];
    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
});

test('support unreachable destination fails', () => {
    const orders = [
        new Order("Austria", "A", "VEN", "H", "VEN", "", "", "", ""),
        new Order("Russia", "A", "APU", "M", "VEN", "", "", "", ""),
        new Order("Russia", "F", "ROM", "S", "ROM", "A", "M", "APU", "VEN")
    ];

    const lon = territories.find(t => t.getId().toUpperCase() === 'VEN');
    lon!.setCountry('Austria');

    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('succeeds');
    expect(orders[1].getResolution()).toBe('fails');
    expect(orders[2].getResolution()).toBe('fails');
});

test('simple bounce fails', () => {
    const orders = [
        new Order("Austria", "A", "VIE", "M", "TYR", "", "", "", ""),
        new Order("Russia", "A", "VEN", "M", "TYR", "", "", "", "")
    ];

    const lon = territories.find(t => t.getId().toUpperCase() === 'VIE');
    lon!.setCountry('Austria');

    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
});

test('three bounce each fails', () => {
    const orders = [
        new Order("Austria", "A", "VIE", "M", "TYR", "", "", "", ""),
        new Order("Russia", "A", "VEN", "M", "TYR", "", "", "", ""),
        new Order("Italy", "A", "BOH", "M", "TYR", "", "", "", "")
    ];

    const lon = territories.find(t => t.getId().toUpperCase() === 'VIE');
    const itl = territories.find(t => t.getId().toUpperCase() === 'BOH');
    lon!.setCountry('Austria');
    itl!.setCountry('Italy');

    new Adjudicator(territories, orders);

    expect(orders[0].getResolution()).toBe('fails');
    expect(orders[1].getResolution()).toBe('fails');
    expect(orders[2].getResolution()).toBe('fails');
});
});
