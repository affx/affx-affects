import { Timer } from "./Timer";

describe("Timer", () => {
  it("should reset timestamp and timerId to null when calling the reset method", () => {
    const fakeTimer = { innerTimestamp: 10, innerTimerId: 42 };

    Timer.prototype.reset.call(fakeTimer);

    expect(fakeTimer).toEqual({ innerTimestamp: null, innerTimerId: null });
  });

  it("should return -1 when comparing with another timestamp and its own timestamp is null", () => {
    const fakeTimer = { innerTimestamp: null };

    const received = Timer.prototype.compare.call(fakeTimer, 42);

    expect(received).toBe(-1);
  });

  it("should return the difference between given timestamps and its own timestamp", () => {
    const fakeTimer = { innerTimestamp: 200 };
    const fakeComparedTimestamp = 250;

    const received = Timer.prototype.compare.call(
      fakeTimer,
      fakeComparedTimestamp,
    );

    expect(received).toBe(50);
  });

  it("should clear its interval, set its own values correctly, then calls setTimeout on start", () => {
    const timer = new Timer();

    const fakeCallback = () => "fakeCallback";

    const fakeDateNow = 42;
    const fakeTimerId = 12;

    const ms = 1000;

    const clearInterval = jest.spyOn(window, "clearInterval");

    const dateNow = jest
      .spyOn(Date, "now")
      .mockImplementation(() => fakeDateNow);

    const setTimeout = jest
      .spyOn(window, "setTimeout")
      .mockImplementation(() => fakeTimerId);

    timer.start(ms, fakeCallback);

    expect(clearInterval).toHaveBeenCalled();
    expect(dateNow).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledWith(fakeCallback, ms);

    expect(timer.timestamp).toBe(fakeDateNow);
    expect(timer.timerId).toBe(fakeTimerId);
  });
});
