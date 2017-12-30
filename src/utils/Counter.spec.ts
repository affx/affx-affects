import { Counter } from "./Counter";

describe("Counter", () => {
  it("should be initialized with a value 0", () => {
    const counter = new Counter();

    expect(counter.value).toBe(0);
  });

  it("should be increment by 2 when increment is called two times", () => {
    const counter = new Counter();

    counter.increment();
    counter.increment();

    expect(counter.value).toBe(2);
  });

  it("should be increment by 2 when increment is called two times then reset 0 on reset", () => {
    const counter = new Counter();

    counter.increment();
    counter.increment();

    expect(counter.value).toBe(2);

    counter.reset();

    expect(counter.value).toBe(0);
  });
});
