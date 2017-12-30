import {
  Action,
  ActionCreator,
  CommandCreator,
  FailableCommandCreator,
} from "affx";

export { ajax } from "./affects/http";
export { debounce } from "./affects/debounce";
export { retry } from "./affects/retry";

export const random = (
  mul: number = 1,
): CommandCreator<number> => actionCreator => async () => {
  return actionCreator(Math.random() * mul);
};

export const randomInt = (
  mul: number = 1,
): CommandCreator<number> => actionCreator => async () => {
  // tslint:disable-next-line:no-bitwise
  return actionCreator(~~(Math.random() * mul));
};

export const delay = (ms: number): CommandCreator => <Actions extends Action>(
  actionCreator: ActionCreator<null, Actions>,
) => async () =>
  new Promise<Actions | void>(resolve => {
    window.setTimeout(() => resolve(actionCreator(null)), ms);
  });

export const getCurrentDate = (): CommandCreator<
  Date
> => actionCreator => async () => actionCreator(new Date());

export const fromPromise = <T>(
  p: () => Promise<T>,
): FailableCommandCreator<T> => failableActionCreator => async () => {
  try {
    const data = await p();

    return failableActionCreator(null, data);
  } catch (error) {
    const defaultError = new Error("Unhandled Error");

    return failableActionCreator(error || defaultError);
  }
};
