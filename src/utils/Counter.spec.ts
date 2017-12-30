import { Counter } from "./Counter";

describe("Counter", () => {
  it("should be initialized at 0", () => {
    const counter = new Counter();

    expect(counter.value).toBe(0);
  });

  it("should be incremented by 2 when the increment method is called two times", () => {
    const counter = new Counter();

    counter.increment();
    counter.increment();

    expect(counter.value).toBe(2);
  });

  it("should have a value set at 0 on reset", () => {
    const counter = new Counter();

    counter.increment();
    counter.increment();

    expect(counter.value).toBe(2);

    counter.reset();

    expect(counter.value).toBe(0);
  });
});
