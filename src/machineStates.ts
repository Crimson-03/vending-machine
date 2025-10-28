import { Currency } from "./denomination";
import { IState } from "./interface";
import { VendingMachine } from "./vendingMachine";

export class IdealState implements IState {
  selectProdcut(
    product: string,
    quantity: number,
    machine: VendingMachine
  ): void {
    const success = machine.setSelecteditem(product, quantity);
    if (success) {
      console.log("Item has been selected:::::", product);
      machine.setState(new ItemSelectedState());
      return;
    }
    console.log('Error: product or desired quantity is available');
  }

  insertMoney(amount: Currency[], machine: VendingMachine): void {
    console.log('Error: Please select item first');
  }

  dispenseProduct(machine: VendingMachine): void {
    console.log('Error: Please Select item first');
  }

  cancelTransaction(machine: VendingMachine): void {
    console.log('Error: No transaction in process');
  }
}

export class ItemSelectedState implements IState {
  dispenseProduct(machine: VendingMachine): void {
    console.log('Error: Enter the money before dispensing item');
  }
  insertMoney(amount: Currency[], machine: VendingMachine): void {
    const success = machine.setInsertedAmount(amount);
    if(!success) {
        console.log('Please insert more money');
        return;
    }
    console.log('Sufficient amount has been inserted');
    machine.setState(new HasMoneyState());
  }
  selectProdcut(
    product: string,
    quantity: number,
    machine: VendingMachine
  ): void {
    console.error('Error: You have alreay selected the item');
  }

  cancelTransaction(machine: VendingMachine): void {
    const refund = machine.cancelTransaction();
    if (refund.length > 0) {
      console.log("Refund issued:");
      for (let c of refund) {
        console.log(`${c.getType()} : ${c.getDenomination()}`);
      }
    }
  }
}


export class HasMoneyState implements IState {
  dispenseProduct(machine: VendingMachine): void {
    console.log('Item is dispending');
    machine.setState(new DispensingState());
    setTimeout(() => {
        const change = machine.calculateChange();
        if(change === -1) {
          machine.resetTransaction();
          return;
        }
        console.log(`Returning change:`);
        for(let curr of change) {
          console.log(`${curr.getType()} : ${curr.getDenomination()}`)
        }
        machine.changeStock(machine.getSelectedItem()!, machine.getSelectedItemQuantity());
        console.log('Item is dispensed')
        machine.resetTransaction();
    }, 5000);
  }
  insertMoney(amount: Currency[], machine: VendingMachine): void {
    console.log('Error: Money has been alreay inserted');
  }
  selectProdcut(
    product: string,
    quantity: number,
    machine: VendingMachine
  ): void {
    console.log('Error: Product has already been selected');
  }
  cancelTransaction(machine: VendingMachine): void {
    const refund = machine.cancelTransaction();
    if (refund.length > 0) {
      console.log("Refund issued:");
      for (let c of refund) {
        console.log(`${c.getType()} : ${c.getDenomination()}`);
      }
    }
  }
}

export class DispensingState implements IState {
  dispenseProduct(machine: VendingMachine): void {
    console.log('Item is dispensing');
  }
  insertMoney(amount: Currency[], machine: VendingMachine): void {
    console.log('Item is dispensing, please wait');
  }
  selectProdcut(
    product: string,
    quantity: number,
    machine: VendingMachine
  ): void {
    console.log('Item is dispensing, please wait');
  }
  cancelTransaction(machine: VendingMachine): void {
    console.log("Error: Item is dispensing... Cannot cancel now.");
  }
}
