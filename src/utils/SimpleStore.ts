export class SimpleStore<T> {
  private innerState: Map<symbol, T> = new Map();

  public get state() {
    return this.innerState;
  }

  public constructor(private ctor: { new (): T }) {}

  public get(id: symbol): T {
    const element = this.innerState.get(id);

    if (element) {
      return element;
    }

    return this.innerState.set(id, new this.ctor()).get(id)!;
  }
}
