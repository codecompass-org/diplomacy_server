export class Territory {
  private id: string;
  private type: string;
  private points: number;
  private neighbors: string[]; // Assuming neighbors are represented by a list of strings (IDs).
  private fleetRestrictions: string[];
  private country: string;
  private unit?: string; // The initial code didn't have a constructor initializer for `unit`, so it could be `undefined`.
  private order?: any; // Type is not specified in the Ruby code.
  private holdStrength: number;

  constructor(
      id: string,
      type: string,
      sc: number,
      neighbors: string[],
      fleetRestrictions: string[] = [],
      country: string
  ) {
      this.id = id.toLowerCase();
      this.type = type;
      this.points = sc;
      this.neighbors = neighbors;
      this.fleetRestrictions = fleetRestrictions;
      this.country = country;
      this.holdStrength = 0;
  }

  getId(): string {
      return this.id;
  }

  getType(): string {
      return this.type;
  }

  getPoints(): number {
      return this.points;
  }

  getNeighbors(): string[] {
      return this.neighbors;
  }

  getFleetRestrictions(): string[] {
      return this.fleetRestrictions;
  }

  getCountry(): string {
      return this.country;
  }

  getUnit(): string | undefined {
      return this.unit;
  }

  getOrder(): any {  // The type is not specified in the Ruby code, hence using `any`.
      return this.order;
  }

  getHoldStrength(): number {
      return this.holdStrength;
  }

  setHoldStrength(s: number): void {
      this.holdStrength = s || 0;
  }

  setStatus(country: string, unit: string): void {
      this.unit = unit;
      this.country = country;
  }

  setCountry(c: string): void {
      this.country = c;
  }
}
