const DEFAULT_OUT_TIME: number = 1000;
const DEFAULT_STEP: number = 500;

abstract class AbstractEStorage {
  abstract storage: Storage;
  set(key: string, value: string): this {
    this.storage.setItem(key, value);
    return this;
  }
  get(key: string): string | null {
    let value: string | null = this.storage.getItem(key);
    return value;
  }
  asyncGet(
    key: string,
    timeout: number = DEFAULT_OUT_TIME,
    step: number = DEFAULT_STEP
  ) {
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
          reject(null);
        }
      }, step);
    });
  }
}

class ESession extends AbstractEStorage {
  storage: Storage = sessionStorage;
  keep() {
    return new ELocal();
  }
}

class ELocal extends AbstractEStorage {
  storage: Storage = localStorage;
  unKeep() {
    return new ESession();
  }
}

export const useEst = () => {
  return new ESession();
};
