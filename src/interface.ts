import { Currency } from "./denomination";
import { VendingMachine } from "./vendingMachine";

export interface IState {
    selectProdcut(product: string, quantity: number, machine: VendingMachine) : void;
    insertMoney(amount: Currency[], machine: VendingMachine) : void;
    cancelTransaction(machine: VendingMachine) : void;
    dispenseProduct(machine: VendingMachine): void;
}


export type currentType = "coin" | "note";

