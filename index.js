const DEFAULT_OUT_TIME = 1000;
const DEFAULT_STEP = 500;
class AbstractEStorage {
    set(key, value) {
        this.storage.setItem(key, value);
        return this;
    }
    get(key) {
        let value = this.storage.getItem(key);
        return value;
    }
    asyncGet(key, timeout = DEFAULT_OUT_TIME, step = DEFAULT_STEP) {
        return new Promise((resolve, reject) => {
            let counter = 0;
            let timer = setInterval(() => {
                const result = this.get(key);
                counter += step;
                if (result) {
                    clearInterval(timer);
                    counter = 0;
                    resolve(result);
                }
                else if (counter >= timeout) {
                    reject(null);
                }
            }, step);
        });
    }
}
class ESession extends AbstractEStorage {
    constructor() {
        super(...arguments);
        this.storage = sessionStorage;
    }
    keep() {
        return new ELocal();
    }
}
class ELocal extends AbstractEStorage {
    constructor() {
        super(...arguments);
        this.storage = localStorage;
    }
    unKeep() {
        return new ESession();
    }
}
export const useEst = () => {
    return new ESession();
};
