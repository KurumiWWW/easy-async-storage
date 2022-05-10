const DEFAULT_OUT_TIME: number = 1000;
const DEFAULT_STEP: number = 500;

abstract class EStorage {
  abstract asyncGet(key: string, timeout?: number): Promise<any>;
}

class ESession extends EStorage {
  asyncGet(key: string, timeout?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let timer = 0;
      let out = timeout ?? DEFAULT_OUT_TIME;
      let step = DEFAULT_STEP;
      let count: number = 0;
      timer = setInterval(() => {
        const result = sessionStorage.getItem(key);
        count += step;
        if (result) {
          clearInterval(timer);
          resolve(result);
        } else if (count >= out) {
          reject(undefined);
        }
      }, step);
    });
  }
}

class ELcoal extends EStorage {
  asyncGet(key: string, timeout?: number | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      let timer = 0;
      let out = timeout ?? DEFAULT_OUT_TIME;
      let step = DEFAULT_STEP;
      let count: number = 0;
      timer = setInterval(() => {
        const result = localStorage.getItem(key);
        count += step;
        if (result) {
          clearInterval(timer);
          resolve(result);
        } else if (count >= out) {
          reject(undefined);
        }
      }, step);
    });
  }
}

export const useEStorage = (type: "local" | "session") => {
  if (type == "local") {
    return new ELcoal();
  } else if (type == "session") {
    return new ESession();
  } else {
    return undefined;
  }
};
