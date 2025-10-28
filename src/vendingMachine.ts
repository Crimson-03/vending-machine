import { Coin, Currency, Note } from "./denomination";
import { IState } from "./interface";
import { IdealState } from "./machineStates";
import { Product } from "./product";

export class VendingMachine {
  private products: Map<string, Product>;
  private machineMoneyTot: number;
  private machineCoins: Coin[];
  private machineNotes: Note[];
  private currentState: IState;
  private selectedProduct: string | null;
  private selectedQuantity: number;
  private insertedAmount: Currency[];
  private insertedCoins: Coin[];
  private insertedNotes: Note[];

  constructor(
    machineMoney: Currency[]
  ) {
    this.currentState = new IdealState();
    this.products = new Map();
    this.machineMoneyTot = 0;
    this.machineCoins = [];
    this.machineNotes = [];
    for(let curr of machineMoney) {
      if (curr.getType() === "coin") this.machineCoins.push(curr);
      else this.machineNotes.push(curr);
      this.machineMoneyTot += curr.getDenomination();
    }
    
    
    this.selectedProduct = null;
    this.insertedAmount = [];
    this.insertedCoins = [];
    this.insertedNotes = [];
    this.selectedQuantity = 0;
  }

  setState(newState: IState) {
    this.currentState = newState;
  }

  addProduct(productName: string, stock: number, price: number): Product {
    if (this.products.get(productName.toLowerCase())) {
      const prod = this.products.get(productName.toLowerCase());
      if (prod) {
        prod?.addQuantity(stock);
        prod?.setPrice(price);
        this.products.set(productName, prod);
        return prod;
      }
    }
    const product = new Product(productName.toLowerCase(), stock, price);
    this.products.set(productName.toLowerCase(), product);
    return product;
  }

  getProducts() {
    for(const [key, value] of this.products) {
        console.log(`Product: ${key} Price: ${value.getPrice()} Stock: ${value.getStocks()}`)
    }
  }

  setSelecteditem(productName: string, quantity: number) : boolean {
    const prod = this.products.get(productName);
    if (prod) {
        const stocks = prod.getStocks();
        if(stocks < quantity) return false;
        this.selectedProduct = productName;
        this.selectedQuantity = quantity;
        return true;
    }
    return false;
  }

  setInsertedAmount(amount: Currency[]) : boolean {
    if(!this.selectedProduct) return false;
    let totalAmount = 0;
    for(let item of amount) {
      totalAmount += item.getDenomination();
      if(item.getType() == "coin") this.insertedCoins.push(item);
      else this.insertedNotes.push(item);
    }
    this.insertedAmount = amount; // ✅ accumulate money

    const prod = this.products.get(this.selectedProduct);


    if (prod) {
      const totalPrice = prod.getPrice() * this.selectedQuantity;
      if (totalAmount < totalPrice) {
        console.log(
          `Inserted: ${this.insertedAmount}, Required: ${totalPrice}`
        );
        return false; // still needs more money
      }
    }
    return true;
  }

  calculateChange(): Currency[] | -1 {
    if(!this.selectedProduct) return -1;
    const prod = this.products.get(this.selectedProduct);
    if(!prod) return -1;
    const totalPrice = prod.getPrice() * this.selectedQuantity;
    console.log('total inserted amount::::', totalPrice)
    let totalInserted = 0;
    for (let item of this.insertedAmount) {
      totalInserted += item.getDenomination();
    }
    let changeToReturn = totalInserted - totalPrice;
    if (changeToReturn < 0) return -1; // insufficient money

    if (changeToReturn === 0) return []; // no change needed

    let change: Currency[] = [];
    let allMoney = [...this.machineCoins, ...this.machineNotes];
    allMoney.sort((a, b) => b.getDenomination() - a.getDenomination());
    for (let i = 0; i < allMoney.length && changeToReturn > 0; i++) {
      const curr = allMoney[i];
      if (curr) {
        const denom = curr.getDenomination();

        if (denom <= changeToReturn) {
          change.push(curr);
          changeToReturn -= denom;
          console.log('Change to reutrn', changeToReturn);
          // remove this coin/note from the copy
          allMoney.splice(i, 1);
          i--; // adjust index since we removed one
        }
      }
    }

    if (changeToReturn > 0) {
      console.log("Error: Cannot make exact change");
      return -1;
    }

    this.insertedAmount = [];

    const newCoins = this.machineCoins.filter((item) => !change.includes(item));
    const newNotes = this.machineNotes.filter((item) => !change.includes(item));
    this.machineCoins = newCoins;
    this.machineNotes = newNotes;

    for (let item of this.insertedAmount) {
      if(item.getType() === "coin") this.machineCoins.push(item);
      else this.machineNotes.push(item)
    }

    let newMachineTot = 0;
    for(let coin of this.machineCoins) newMachineTot += coin.getDenomination();
    for(let note of this.machineNotes) newMachineTot += note.getDenomination();
    this.machineMoneyTot = newMachineTot;
  
    return change;  
  }

  changeStock(productName: string, quantity: number) {
    const prod = this.products.get(productName);
    if(prod) {
        prod.reduceQuantity(quantity);
    }
  }

  cancelTransaction() : Currency[] {
    const refund: Currency[] = [];

    if (this.insertedAmount.length > 0) {
      refund.push(...this.insertedAmount);
    }

    if (this.selectedProduct) {
      console.log(
        `Transaction cancelled. Refunding amount: ${refund
          .map((c) => `${c.getType()}-${c.getDenomination()}`)
          .join(", ")}`
      );
    } else {
      console.log("No active transaction to cancel.");
    }

    // Reset machine state
    this.resetTransaction();
    return refund;
  }

  getSelectedItem() {
    return this.selectedProduct;
  }

  getSelectedItemQuantity() { 
    return this.selectedQuantity;
  }

  selectItem(productName: string, quantity: number) {
    this.currentState.selectProdcut(productName, quantity, this);
  }

  insertAmount(amount: Currency[]) {
    this.currentState.insertMoney(amount, this);
  }

  dispenseItem() {
    this.currentState.dispenseProduct(this);
  }

  cancelTheTransaction() {
    this.currentState.cancelTransaction(this);
  }

  resetTransaction() : void {
    this.selectedProduct = null;
    this.selectedQuantity = 0;
    this.insertedAmount = [];
    this.insertedCoins = [];
    this.insertedNotes = [];
    this.currentState = new IdealState();
  }

  factoryReset() : void {
    this.machineCoins = [];
    this.currentState = new IdealState();
    this.insertedAmount = [];
    this.insertedCoins = [];
    this.insertedNotes = [];
    this.machineNotes = [];
    this.products = new Map();
    this.selectedProduct = null;
    this.selectedQuantity = 0;
  }

}