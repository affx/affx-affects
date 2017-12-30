import { FailableCommandCreator } from "affx";

import { fromPromise } from "../index";

export type FetchBodyMethod =
  | "arrayBuffer"
  | "blob"
  | "json"
  | "text"
  | "formData";

export interface AjaxOptions {
  timeout?: number;
}

export const ajax = <Schema>(
  input: RequestInfo,
  method: FetchBodyMethod,
  options: RequestInit & AjaxOptions = {},
): FailableCommandCreator<Schema> => {
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
