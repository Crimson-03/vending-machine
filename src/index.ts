import { Coin, Note } from "./denomination";
import { VendingMachine } from "./vendingMachine";

const vendingMachine = new VendingMachine([
  new Coin(5),
  new Coin(10),
  new Note(10),
  new Note(20),
]);
vendingMachine.getProducts();
const pepsi = vendingMachine.addProduct('Pepsi', 5, 20);
const lays = vendingMachine.addProduct('Chips', 10, 10);
const milk = vendingMachine.addProduct('Milk', 10, 25);
vendingMachine.getProducts();

const coinTen = new Coin(10);
const coinFive = new Coin(5);
const noteTwnenty = new Note(20);

vendingMachine.selectItem('hellazdlkfj', 1);
vendingMachine.selectItem(pepsi.getName(), 1);
vendingMachine.insertAmount([noteTwnenty]);
vendingMachine.cancelTransaction();
vendingMachine.dispenseItem();
