const DEFAULT_OUT_TIME: number = 1000;
const DEFAULT_STEP: number = 500;

interface CheckResult {
  status: boolean;
  target?: EStorage;
}
interface EStorage {
  storage: Storage;
  check(key: string): CheckResult;
  getStorage(key: string): string;
  set(key: string, value: string): EStorage;
  get(key: string): string;
  asyncGet(key: string): Promise<string>;
}

abstract class AbstractEStorage implements EStorage {
  abstract storage: Storage;
  abstract check(key: string): CheckResult;
  abstract getStorage(key: string): string;
  set(key: string, value: string): EStorage {
    if (typeof value != "string") {
      throw new Error(`Invalid "value" type`);
    }
    this.storage.setItem(key, value);
    return this;
  }
  get(key: string): string {
    let checkObj: CheckResult = this.check(key);
    if (checkObj.status && checkObj.target) {
      return checkObj.target.getStorage(key);
    } else {
      throw new Error(`Cannot find value where key is "${key}"`);
    }
  }
  asyncGet(
    key: string,
    timeout: number = DEFAULT_OUT_TIME,
    step: number = DEFAULT_STEP
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let counter: number = 0;
      let timer = setInterval(() => {
        const result = this.get(key);
        counter += step;
        if (result) {
          clearInterval(timer);
          counter = 0;
          resolve(result);
        } else if (counter >= timeout) {
          reject(new Error(`Cannot find value where key is "${key}"`));
        }
      }, step);
    });
  }
}

class ESession extends AbstractEStorage {
  storage: Storage = sessionStorage;
  keep(): EStorage {
    return new ELocal();
  }
  getStorage(key: string): string {
    const result = sessionStorage.getItem(key);
    if (result == null) {
      throw new Error(`Cannot find value where key is "${key}"`);
    } else {
      return String(result);
    }
  }
  check(key: string): CheckResult {
    if (sessionStorage.getItem(key) != null) {
      return {
        status: true,
        target: this,
      };
    } else if (localStorage.getItem(key) != null) {
      return {
        status: true,
        target: this.keep(),
      };
    } else {
      return {
        status: false,
      };
    }
  }
}

class ELocal extends AbstractEStorage {
  storage: Storage = localStorage;
  unKeep(): EStorage {
    return new ESession();
  }
  getStorage(key: string): string {
    const result = localStorage.getItem(key);
    if (result == null) {
      throw new Error(`Cannot find value where key is "${key}"`);
    } else {
      return String(result);
    }
  }
  check(key: string): CheckResult {
    if (localStorage.getItem(key) != null) {
      return {
        status: true,
        target: this,
      };
    } else if (sessionStorage.getItem(key) != null) {
      return {
        status: true,
        target: this.unKeep(),
      };
    } else {
      return {
        status: false,
      };
    }
  }
}

export const eStorage = () => {
  return new ESession();
};
