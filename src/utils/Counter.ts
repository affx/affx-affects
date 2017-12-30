export class Counter {
  private innerValue: number = 0;

  public get value() {
    return this.innerValue;
  }

  public increment() {
    this.innerValue++;
  }

  public reset() {
    this.innerValue = 0;
  }
}
