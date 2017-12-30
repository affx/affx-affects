import {
  Action,
  Command,
  FailableActionCreator,
  FailableCommandCreator,
} from "affx";

import { Counter, SimpleStore } from "../utils";

const retryStore = new SimpleStore(Counter);

export const retry = <T>(
  id: symbol,
  n: number,
  commandCreator: FailableCommandCreator<T>,
): FailableCommandCreator<T> => {
  const counter = retryStore.get(id);

  return function rec<Actions extends Action>(
    failableActionCreator: FailableActionCreator<T, Actions>,
  ): Command<Actions> {
    const proxiedFailableActionCreator: FailableActionCreator<T, Actions> = (
      error,
      data,
    ) => {
      if (error) {
        throw error;
      }

      return failableActionCreator(null, data);
    };

    return async () => {
      try {
        return await commandCreator(proxiedFailableActionCreator)();
      } catch (error) {
        if (counter.value < n - 1) {
          counter.increment();

          return await rec(failableActionCreator)();
        }

        counter.reset();

        return failableActionCreator(error);
      }
    };
  };
};
