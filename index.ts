const DEFAULT_OUT_TIME: number = 1000;
const DEFAULT_STEP: number = 500;

interface CheckResult {
  status: boolean;
  target?: EStorage;
}
interface EStorage {
  storage: Storage;
  check(key: string): Promise<CheckResult>;
  getStorage(key: string): string;
  set(key: string, value: string): EStorage;
  get(key: string): Promise<any>;
  asyncGet(key: string): Promise<string>;
}

abstract class AbstractEStorage implements EStorage {
  abstract storage: Storage;
  abstract stateTrigger(): EStorage;
  abstract getStorage(key: string): string;
  set(key: string, value: string): EStorage {
    if (typeof value != "string") {
      throw new Error(`Invalid "value" type`);
    }
    this.storage.setItem(key, value);
    return this;
  }
  async get(key: string): Promise<any> {
    const res = await this.check(key);
    if (res.status) {
      return res.target?.getStorage(key);
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
        this.get(key).then((result) => {
          counter += step;
          if (result) {
            clearInterval(timer);
            counter = 0;
            resolve(result);
          } else if (counter >= timeout) {
            reject(new Error(`Cannot find value where key is "${key}"`));
          }
        });
      }, step);
    });
  }
  check(key: string): Promise<CheckResult> {
    return new Promise((resolve, reject) => {
      if (sessionStorage.getItem(key) != null) {
        resolve({
          status: true,
          target: this,
        });
      } else if (localStorage.getItem(key) != null) {
        resolve({
          status: true,
          target: this.stateTrigger(),
        });
      } else {
        reject({
          status: false,
        });
      }
    });
  }
}

class ESession extends AbstractEStorage {
  storage: Storage = sessionStorage;
  keep(): EStorage {
    return new ELocal();
  }
  stateTrigger() {
    return this.keep();
  }
  getStorage(key: string): string {
    const result = sessionStorage.getItem(key);
    if (result == null) {
      throw new Error(`Cannot find value where key is "${key}"`);
    } else {
      return String(result);
    }
  }
}

class ELocal extends AbstractEStorage {
  storage: Storage = localStorage;
  unKeep(): EStorage {
    return new ESession();
  }
  stateTrigger() {
    return this.unKeep();
  }
  getStorage(key: string): string {
    const result = localStorage.getItem(key);
    if (result == null) {
      throw new Error(`Cannot find value where key is "${key}"`);
    } else {
      return String(result);
    }
  }
}

export const eStorage = () => {
  // return new ESession();
  const e = new ESession();
  return {
    keep: () => e.keep(),
    set: (key: string, value: string) => e.set(key, value),
    get: (key: string) => e.get(key),
    asyncGet: (key: string, timeout?: number, step?: number) =>
      e.asyncGet(key, timeout, step),
    check: (key: string) => e.check(key),
  };
};
