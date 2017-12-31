import * as affects from "./index";

describe("Affects", () => {
  describe("random", () => {
    it(`should call the provided action creator with
        the mocked random number correctly multiplied`, async () => {
      const fakeRandomNumnber = 0.422345334;

      const multiplier = 42;

      const random = jest
        .spyOn(Math, "random")
        .mockImplementation(() => fakeRandomNumnber);

      const fakeAction = { type: "FAKE" };

      const fakeActionCreator = jest.fn(() => fakeAction);

      const commandCreator = affects.random(multiplier);

      const command = commandCreator(fakeActionCreator);

      const action = await command();

      expect(random).toHaveBeenCalled();
      expect(fakeActionCreator).toBeCalledWith(multiplier * fakeRandomNumnber);
      expect(action).toBe(fakeAction);
    });
  });

  describe("randomInt", () => {
    it(`should call the provided action creator with
        the mocked random number correctly multiplied then rounded`, async () => {
      const fakeRandomNumnber = 0.422345334;

      const multiplier = 42;

      const random = jest
        .spyOn(Math, "random")
        .mockImplementation(() => fakeRandomNumnber);

      const fakeAction = { type: "FAKE" };

      const fakeActionCreator = jest.fn(() => fakeAction);

      const commandCreator = affects.randomInt(multiplier);

      const command = commandCreator(fakeActionCreator);

      const action = await command();

      expect(random).toHaveBeenCalled();
      expect(fakeActionCreator).toBeCalledWith(
        // tslint:disable-next-line:no-bitwise
        ~~(multiplier * fakeRandomNumnber),
      );
      expect(action).toBe(fakeAction);
    });
  });

  describe("delay", () => {
    it.skip("should work");
  });

  describe("getCurrentDate", () => {
    it("should call the provided action creator with the mocked current date", async () => {
      const fakeDate = new Date("2018-01-01");

      const now = jest
        .spyOn(window, "Date" as any)
        .mockImplementation(() => fakeDate);

      const fakeAction = { type: "FAKE" };

      const fakeActionCreator = jest.fn(() => fakeAction);

      const commandCreator = affects.getCurrentDate();

      const command = commandCreator(fakeActionCreator);

      const action = await command();

      expect(now).toHaveBeenCalled();
      expect(fakeActionCreator).toBeCalledWith(fakeDate);
      expect(action).toBe(fakeAction);
    });
  });

  describe("fromPromise", () => {
    it.skip("should work");
  });
});
