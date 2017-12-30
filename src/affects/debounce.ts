import { Action, ActionCreator, CommandCreator } from "affx";

import { SimpleStore, Timer } from "../utils";

const timerStore = new SimpleStore(Timer);

export const debounce = (id: symbol, ms: number): CommandCreator => {
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
