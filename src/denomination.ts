import { currentType } from "./interface";

export abstract class Currency {
  private denomination: number;
  private type: currentType;
  constructor(denomination: number, type: currentType) {
    this.denomination = denomination;
    this.type = type;
  }
  getDenomination(): number {
    return this.denomination;
  }
  getType() : currentType {
    return this.type;
  }
}

export class Coin extends Currency {
  constructor(denomination: number) {
    super(denomination, "coin");
  }
}

export class Note extends Currency {
  constructor(denomination: number) {
    super(denomination, "note");
  }
}
