import { Order } from "../models/Order";
import { Territory } from "../models/Territory";

export class Adjudicator {
  private readonly FAILS = 'fails';
  private readonly SUCCEEDS = 'succeeds';
  private readonly UNRESOLVED = 'unresolved';
  private readonly GUESSING = 'guessing';
  private readonly RESOLVED = 'resolved';
  private dep_list: Order[] = [];
  private nr_of_dep = 0;
  private territories: Territory[];
  private orders: Order[];

  constructor(territories: Territory[], orders: Order[]) {
      this.territories = territories;
      this.orders = orders;
      for (let o of orders) {
          this.resolve(o);
      }
  }

// Assuming you have already declared the Order type
backup_rule(nr_of_dep: number): void {
  this.dep_list[--nr_of_dep].setState(this.RESOLVED);
  this.dep_list[--nr_of_dep].setResolution(this.SUCCEEDS);
}

adjudicate(order: any): any {
  const t = this.getTerritoryById(order.territory);
  const t2 = this.getTerritoryById(order.moveTerritory);
  if (!t || !t2) return;

  const h2hOrder = this.orders.find(o => o.getMoveTerritory() === order.territory);
  const moveTerritory = t2;
  const competeOrders = this.orders.filter(o => 
    o.getMoveTerritory() === order.moveTerritory && o.getTerritory() !== order.territory
  );

  if(order.type === 'H') {
      if(this.isValidMove(order)) {
          t.setHoldStrength(this.calculateMoveStrength(order));
          order.setDefendStrength(this.calculateDefendStrength(order));
          order.setPreventStrength(this.calculatePreventStrength(order));
          if(this.beatsAttacks(moveTerritory, competeOrders)) {
              order.setState(this.RESOLVED);
              order.setResolution(this.SUCCEEDS);
          } else {
              order.setState(this.RESOLVED);
              order.setResolution(this.FAILS);
          }
      } else {
          order.setState(this.RESOLVED);
          order.setResolution(this.FAILS);
      }
  }

  if(order.type === 'M') {
      if(this.isValidMove(order)) {
          this.buildPath(order);
          order.setDefendStrength(this.calculateDefendStrength(order));
          order.setPreventStrength(this.calculatePreventStrength(order));
          if(h2hOrder) {
              h2hOrder.setDefendStrength(this.calculateDefendStrength(h2hOrder));
              h2hOrder.setPreventStrength(this.calculatePreventStrength(h2hOrder));

              if(order.attackStrength > h2hOrder.getDefendStrength() && this.beatsPrevents(order, competeOrders)) {
                  order.setState(this.RESOLVED);
                  order.setResolution(this.SUCCEEDS);
              } else {
                  order.setState(this.RESOLVED);
                  order.setResolution(this.FAILS);
              }
          } else {
              if(order.attackStrength > moveTerritory.getHoldStrength() && this.beatsPrevents(order, competeOrders)) {
                  order.setState(this.RESOLVED);
                  order.setResolution(this.SUCCEEDS);
              } else {
                  order.setState(this.RESOLVED);
                  order.setResolution(this.FAILS);
              }
          }
      } else {
          order.setState(this.RESOLVED);
          order.setResolution(this.FAILS);
      }
  }

  if(order.type === 'C') {
      const orderForConvoyTerritory = this.orders.find(o => o.getTerritory() === order.supportTerritory);
      if(this.isValidConvoy(order, orderForConvoyTerritory)) {
          t.setHoldStrength(this.calculateMoveStrength(order));
          order.setDefendStrength(this.calculateDefendStrength(order));
          order.setPreventStrength(this.calculatePreventStrength(order));
          if(this.beatsAttacks(moveTerritory, competeOrders)) {
              order.setState(this.RESOLVED);
              order.setResolution(this.SUCCEEDS);
          } else {
              order.setState(this.RESOLVED);
              order.setResolution(this.FAILS);
          }
      } else {
          order.setState(this.RESOLVED);
          order.setResolution(this.FAILS);
      }
  }

  if(order.type === 'S') {
      const orderForSupportTerritory = this.orders.find(o => o.getTerritory() === order.supportTerritory);
      if(this.isValidSupport(order, orderForSupportTerritory)) {
          t.setHoldStrength(this.calculateMoveStrength(order));
          order.setDefendStrength(this.calculateDefendStrength(order));
          order.setPreventStrength(this.calculatePreventStrength(order));
          if(this.beatsAttacks(moveTerritory, competeOrders)) {
              order.setState(this.RESOLVED);
              order.setResolution(this.SUCCEEDS);
          } else {
              order.setState(this.RESOLVED);
              order.setResolution(this.FAILS);
          }
      } else {
          order.setState(this.RESOLVED);
          order.setResolution(this.FAILS);
      }
  }

  return order.resolution;
}


beatsAttacks(territory: Territory, competeOrders: Order[]): boolean {
  for (let c of competeOrders) {
      if (c.getAttackStrength() > territory.getHoldStrength()) {
          return false;
      }
  }
  return true;
}

beatsPrevents(order: Order, competeOrders: Order[]): boolean {
  for (let c of competeOrders) {
      this.resolve(c);
      if (c.getPreventStrength() >= order.getAttackStrength()) {
          return false;
      }
  }
  return true;
}

buildPath(order: any): void {
  const t = this.getTerritoryById(order.territory);
  const t2 = this.getTerritoryById(order.moveTerritory);
  if (!t || !t2) return;
  const orderForMoveTerritory = this.orders.find(o => o.getTerritory() === order.moveTerritory);

  if (orderForMoveTerritory && this.isSameNationalityAttack(order, orderForMoveTerritory)) {
      order.setAttackStrength(0);
  } else if (t.getNeighbors().includes(order.moveTerritory)) {
      // direct move
      order.setAttackStrength(this.calculateMoveStrength(order));
  } else {
      // indirect move (convoy)
      const convoys = this.orders.filter(o => this.isValidConvoy(o, order));
      for (const c of convoys) {
          this.resolve(c);
      }
      const isValid = this.getValidConvoyPath(convoys, t, t2);
      const validConvoys = convoys.filter(c => c.getVisited());
      if (!isValid || validConvoys.some(f => f.getResolution() === this.FAILS)) {
          order.setState(this.RESOLVED);
          order.setResolution(this.FAILS);
          order.setPreventStrength(0);
      } else {
          order.setAttackStrength(this.calculateMoveStrength(order));
      }
  }
}



isValidConvoy(o: any, order: any): boolean {
  return order !== undefined && 
         o.type === 'C' && 
         o.unit === 'F' && 
         o.supportUnit === 'A' && 
         o.supportTerritory === order.territory && 
         o.supportToTerritory === order.moveTerritory && 
         this.getTerritoryById(o.territory)?.getType() === 'w' && 
         this.isValidMove(order);
}


getValidConvoyPath(convoys: any[], start: any, endT: any): boolean {
  let startConvoys = convoys.filter(c => start.neighbors.includes(c.territory));
  let remainingConvoys = convoys.filter(c => !startConvoys.includes(c));
  let valid = false;

  for (let c of startConvoys) {
      if (c.resolution === this.SUCCEEDS) {
          c.setVisited();
      } else {
          return false;
      }

      if (remainingConvoys.length === 0) {
          // we're at the end, check if we're adjacent to the end
          if (endT.neighbors.includes(c.territory)) {
              // this path is valid
              return true;
          } else {
              c.removeVisited();
              return false;
          }
      } else {
          valid = this.getValidConvoyPath(remainingConvoys, this.getTerritoryById(c.territory), endT);
          if (!valid) {
              c.removeVisited();
          }
      }
  }
  return valid;
}


isSameNationalityAttack(fromOrder: any, toOrder: any): boolean {
  const toOrderResolved = this.resolve(toOrder);
  return fromOrder.country === toOrder.country &&
    (
      (
        toOrder.type === 'M' &&
        !toOrderResolved
      ) ||
      (
        toOrder.type !== 'M' &&
        !!toOrderResolved
      )
    );
}


getTerritoryById(id: string): Territory | undefined {
  return this.territories.find(t => t.getId() === id);
}

calculatePreventStrength(order: any): number {
  let strength = 1;
  this.orders.forEach(o => {
      if (this.isValidSupport(o, order)) {
          if (this.resolve(o)) {
              strength++;
          }
      }
  });
  return strength;
}


calculateDefendStrength(order: any): number {
  let strength = 1;
  this.orders.forEach(o => {
      if (this.isValidSupport(o, order)) {
          if (this.resolve(o)) {
              strength++;
          }
      }
  });
  return strength;
}


calculateMoveStrength(order: any): number {
  let strength = 1;
  this.orders.forEach(o => {
      if (this.isValidSupport(o, order)) {
          const orderBeingAttacked = this.orders.find(innerOrder => innerOrder.getTerritory() === order.moveTerritory);
          if (orderBeingAttacked && orderBeingAttacked.getCountry() === o.getCountry()) {
              // do nothing
          } else if (this.resolve(o)) {
              strength++;
          }
      }
  });
  return strength;
}


isValidSupport(o: any, receivingOrder: any): boolean {
  const t = this.getTerritoryById(o.territory);
  if (!t) return false;
  return o.type === 'S' &&
         t.getNeighbors().includes(o.supportToTerritory) &&
         this.isValidMoveForSupport(o) &&
         this.isValidMove(receivingOrder) &&
         o.supportUnit === receivingOrder.unit &&
         o.supportTerritory === receivingOrder.territory &&
         o.supportToTerritory === receivingOrder.moveTerritory;
}


isValidMoveForSupport(o: any): boolean {
  const fromTerritory = this.getTerritoryById(o.territory);
  const toTerritory = this.getTerritoryById(o.supportToTerritory);
  if (!fromTerritory || !toTerritory) return false;

  return (o.unit === 'A' && ['l', 'c'].includes(toTerritory.getType())) ||
         (o.unit === 'F' && ['w', 'c'].includes(toTerritory.getType()) && !toTerritory.getFleetRestrictions().includes(fromTerritory.getId()));
}


isValidMove(o: any): boolean {
  const fromTerritory = this.getTerritoryById(o.territory);
  const toTerritory = this.getTerritoryById(o.moveTerritory);
  if (!fromTerritory || !toTerritory) return false;

  return (
      (o.unit === 'A' && ['l', 'c'].includes(toTerritory.getType())) ||
      (o.unit === 'F' && ['w', 'c'].includes(toTerritory.getType()) && !toTerritory.getFleetRestrictions().includes(fromTerritory.getId()))
  ) && 
  fromTerritory.getId() === o.territory &&
  fromTerritory.getCountry() === o.country &&
  (
      (o.type === 'M' && fromTerritory.getId() !== toTerritory.getId()) ||
      (['H', 'S', 'C'].includes(o.type) && fromTerritory.getId() === toTerritory.getId())
  );
}


resolve(order: any): any {
  if (order.state === this.RESOLVED) {
      return order.resolution;
  }

  if (order.state === this.GUESSING) {
      let i = 0;
      while (i < this.nr_of_dep) {
          if (this.dep_list[++i] === order) {
              return order.resolution;
          }
      }
      this.dep_list[++this.nr_of_dep] = order;
      return order.resolution;
  }

  const old_nr_of_dep = this.nr_of_dep;

  order.setResolution(this.FAILS);
  order.setState(this.GUESSING);

  const first_result = this.adjudicate(order);
  if (this.nr_of_dep === old_nr_of_dep) {
      if (order.state !== this.RESOLVED) {
          order.setResolution(first_result);
          order.setState(this.RESOLVED);
      }
  }

  if (this.dep_list[old_nr_of_dep] !== order) {
      this.dep_list[++this.nr_of_dep] = order;
      order.setResolution(first_result);
      return first_result;
  }

  while (this.nr_of_dep > old_nr_of_dep) {
      this.dep_list[--this.nr_of_dep].setState(this.UNRESOLVED);
  }

  order.setResolution(this.SUCCEEDS);
  order.setState(this.GUESSING);

  const second_result = this.adjudicate(order);
  if (first_result === second_result) {
      while (this.nr_of_dep > old_nr_of_dep) {
          this.dep_list[--this.nr_of_dep].setState(this.UNRESOLVED);
      }
      order.setResolution(first_result);
      order.setState(this.RESOLVED);
      return first_result;
  }

  this.backup_rule(old_nr_of_dep);

  return this.resolve(order);  // Assuming you meant "order" here instead of "nr"
}


// ... (continue translating any remaining methods) ...

}

// Note: You'd need to translate the other methods similarly. 
// The example above provides an outline of how to convert the given Ruby class to TypeScript.
// This includes translating instance variables, method definitions, and method bodies. 
// Additionally, you'd need to define TypeScript types or interfaces that correspond to the Ruby classes you're using.
