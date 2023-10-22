export class Order {
  private country: string;
  private unit: string;
  private territory: string;
  private type: string;
  private moveTerritory: string;
  private supportUnit: string;
  private supportOrder: string;
  private supportTerritory: string;
  private supportToTerritory: string;
  private attackStrength: number = 0;
  private defendStrength: number = 0;
  private preventStrength: number = 0;
  private state?: string;
  private resolution?: string;
  private visited?: boolean;

  constructor(
      country: string,
      unit: string,
      territory: string,
      order: string,
      moveTerritory: string,
      supportUnit: string,
      supportOrder: string,
      supportTerritory: string,
      supportToTerritory: string
  ) {
      this.country = country;
      this.unit = unit;
      this.territory = territory.toLowerCase();
      this.type = order;
      this.moveTerritory = moveTerritory.toLowerCase();
      this.supportUnit = supportUnit;
      this.supportOrder = supportOrder;
      this.supportTerritory = supportTerritory.toLowerCase();
      this.supportToTerritory = supportToTerritory.toLowerCase();
  }

  getUnit(): string {
      return this.unit;
  }

  getTerritory(): string {
      return this.territory;
  }

  getType(): string {
      return this.type;
  }

  getMoveTerritory(): string {
      return this.moveTerritory;
  }

  getSupportUnit(): string {
      return this.supportUnit;
  }

  getSupportOrder(): string {
      return this.supportOrder;
  }

  getSupportTerritory(): string {
      return this.supportTerritory;
  }

  getSupportToTerritory(): string {
      return this.supportToTerritory;
  }

  getCountry(): string {
      return this.country;
  }

  getState(): string | undefined {
      return this.state;
  }

  getResolution(): string | undefined {
      return this.resolution;
  }
  getVisited(): boolean | undefined {
      return this.visited;
  }

  setResolution(r: string): void {
      if (r === 'fails') {
          this.setAttackStrength(0);
      }
      this.resolution = r;
  }

  setState(s: string): void {
      this.state = s;
  }

  getAttackStrength(): number {
      return this.attackStrength;
  }

  getDefendStrength(): number {
      return this.defendStrength;
  }

  getPreventStrength(): number {
      return this.preventStrength;
  }

  setDefendStrength(s: number): void {
      this.defendStrength = s || 0;
  }

  setAttackStrength(s: number): void {
      this.attackStrength = s || 0;
  }

  setPreventStrength(s: number): void {
      this.preventStrength = s || 0;
  }

  isVisited(): boolean {
      return this.visited ?? false;
  }

  setVisited(): void {
      this.visited = true;
  }

  removeVisited(): void {
      this.visited = false;
  }
}
