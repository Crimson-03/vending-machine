export class Product {
    private name: string;
    private stock: number;
    private price: number;

    constructor(name: string, stock: number, price: number) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    addQuantity(x : number) : void {
        this.stock  = this.stock + x;
    }

    setPrice(price: number) : void {
        this.price = price;
    }

    reduceQuantity(x: number) : void {
        this.stock = this.stock - x;
    }

    getName() : string {
        return this.name;
    }

    getPrice() : number {
        return this.price;
    }

    getStocks() : number { 
        return this.stock;
    }
}