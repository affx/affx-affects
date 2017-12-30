import {
  Action,
  ActionCreator,
  Command,
  CommandBuilder,
  FailableActionCreator,
  FailableCommandBuilder,
} from "affx";

import { SimpleStore, Timer } from "./utils";
import { Counter } from "./utils/Counter";

export type FetchBodyMethod =
  | "arrayBuffer"
  | "blob"
  | "json"
  | "text"
  | "formData";

const retryStore = new SimpleStore(Counter);
const timerStore = new SimpleStore(Timer);

export const retry = <T>(
  id: symbol,
  n: number,
  cmdBuilder: FailableCommandBuilder<T>,
): FailableCommandBuilder<T> => {
  const counter = retryStore.get(id);

  return function rec<Actions extends Action>(
    failableActionCreator: FailableActionCreator<T, Actions>,
  ): Command<Actions> {
    const fakeFailableActionCreator: FailableActionCreator<T, Actions> = ({
      data,
      error,
    }) => {
      if (error) {
        throw error;
      }

      return failableActionCreator({ data });
    };

    return async () => {
      try {
        return await cmdBuilder(fakeFailableActionCreator)();
      } catch (error) {
        if (counter.value < n - 1) {
          counter.increment();

          return await rec(failableActionCreator)();
        }

        counter.reset();

        return failableActionCreator({ error });
      }
    };
  };
};

export const random = (
  mul: number = 1,
): CommandBuilder<number> => actionCreator => async () => {
  return actionCreator(Math.random() * mul);
};

export const randomInt = (
  mul: number = 1,
): CommandBuilder<number> => actionCreator => async () => {
  // tslint:disable-next-line:no-bitwise
  return actionCreator(~~(Math.random() * mul));
};

export const delay = (ms: number): CommandBuilder => <Actions extends Action>(
  actionCreator: ActionCreator<null, Actions>,
) => async () =>
  new Promise<Actions | void>(resolve => {
    window.setTimeout(() => resolve(actionCreator(null)), ms);
  });

export const getCurrentDate = (): CommandBuilder<
  Date
> => actionCreator => async () => actionCreator(new Date());

export const debounce = (id: symbol, ms: number): CommandBuilder => {
  const timer = timerStore.get(id);

  return <Actions extends Action>(
    actionCreator: ActionCreator<null, Actions>,
  ) => async () =>
    new Promise<Actions | void>(resolve => {
      if (timer.compare(Date.now()) < ms) {
        timer.start(ms, () => {
          resolve(actionCreator(null));
          timer.reset();
        });

        return;
      }
    });
};

export const fromPromise = <T>(
  p: () => Promise<T>,
): FailableCommandBuilder<T> => failableActionCreator => async () => {
  try {
    const data = await p();

    return failableActionCreator({ data });
  } catch (error) {
    const defaultError = new Error("Unhandled Error");

    return failableActionCreator({ error: error || defaultError });
  }
};

export interface AjaxOptions {
  timeout?: number;
}

export const ajax = <Schema>(
  input: RequestInfo,
  method: FetchBodyMethod,
  options: RequestInit & AjaxOptions = {},
): FailableCommandBuilder<Schema> => {
  const { timeout, ...init } = options;

  return fromPromise(async () => {
    const fetchPromise = fetch(input, init);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(reject, timeout);
    });
    const promises =
      typeof timeout !== "number"
        ? [fetchPromise]
        : [fetchPromise, timeoutPromise];
    const response = await Promise.race(promises);

    return await response[method]();
  });
};
