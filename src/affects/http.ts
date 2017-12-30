import { FailableCommandCreator } from "affx";

import { fromPromise } from "../index";

export interface HttpOptions extends RequestInit {
  timeout?: number;
}

export const http = (
  input: RequestInfo,
  options: HttpOptions = {},
): (() => Promise<Response>) => {
  const { timeout, ...init } = options;

  return async () => {
    const fetchPromise = fetch(input, init);

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(reject, timeout);
    });

    const promises =
      typeof timeout !== "number"
        ? [fetchPromise]
        : [fetchPromise, timeoutPromise];

    return await Promise.race(promises);
  };
};

export const getString = (
  responsePromise: () => Promise<Response>,
): FailableCommandCreator<string> => {
  return fromPromise(async () => {
    const response = await responsePromise();

    return await response.text();
  });
};

export const getJSON = <Schema>(
  responsePromise: () => Promise<Response>,
): FailableCommandCreator<Schema> => {
  return fromPromise(async () => {
    const response = await responsePromise();

    return await response.json();
  });
};
