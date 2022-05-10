const DEFAULT_OUT_TIME = 1000;
const DEFAULT_STEP = 500;
class EStorage {}
class ESession extends EStorage {
  asyncGet(key, timeout) {
    return new Promise((resolve, reject) => {
      let timer = 0;
      let out =
        timeout !== null && timeout !== void 0 ? timeout : DEFAULT_OUT_TIME;
      let step = DEFAULT_STEP;
      let count = 0;
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
  asyncGet(key, timeout) {
    return new Promise((resolve, reject) => {
      let timer = 0;
      let out =
        timeout !== null && timeout !== void 0 ? timeout : DEFAULT_OUT_TIME;
      let step = DEFAULT_STEP;
      let count = 0;
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
export const useEStorage = (type) => {
  if (type == "local") {
    return new ELcoal();
  } else if (type == "session") {
    return new ESession();
  } else {
    return undefined;
  }
};
