import { SimpleStore } from "./SimpleStore";

describe("SimpleStore", () => {
  it(`should call the given constructor when calling the get method
       if the given id is missing from the state`, () => {
    const fakeConstructor = jest.fn();

    const store = new SimpleStore(fakeConstructor);

    store.get(Symbol());

    expect(fakeConstructor).toHaveBeenCalled();
  });

  it(`should return the instance built when calling the get method
       if the given id is missing from the state`, () => {
    const fakeInstance = { value: 42 };

    const fakeConstructor = jest.fn(() => fakeInstance);

    const store = new SimpleStore(fakeConstructor);

    const received = store.get(Symbol());

    expect(received).toEqual(fakeInstance);
  });

  it(`should return the instance built when calling the get method the first time
      and not call the constructor again if the given id exists in the state`, () => {
    const fakeId = Symbol();

    const fakeInstance = { value: 42 };

    const fakeConstructor = jest.fn(() => fakeInstance);

    const store = new SimpleStore(fakeConstructor);

    store.get(fakeId);

    const received = store.get(fakeId);

    expect(fakeConstructor).toHaveBeenCalledTimes(1);
    expect(received).toEqual(fakeInstance);
  });
});
