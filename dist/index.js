const DEFAULT_OUT_TIME = 1000;
const DEFAULT_STEP = 500;
class AbstractEStorage {
    set(key, value) {
        if (typeof value != "string") {
            throw new Error(`Invalid "value" type`);
        }
        this.storage.setItem(key, value);
        return this;
    }
    get(key) {
        let checkObj = this.check(key);
        if (checkObj.status && checkObj.target) {
            return checkObj.target.getStorage(key);
        }
        else {
            throw new Error(`Cannot find value where key is "${key}"`);
        }
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
                    reject(new Error(`Cannot find value where key is "${key}"`));
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
    getStorage(key) {
        const result = sessionStorage.getItem(key);
        if (result == null) {
            throw new Error(`Cannot find value where key is "${key}"`);
        }
        else {
            return String(result);
        }
    }
    check(key) {
        if (sessionStorage.getItem(key) != null) {
            return {
                status: true,
                target: this,
            };
        }
        else if (localStorage.getItem(key) != null) {
            return {
                status: true,
                target: this.keep(),
            };
        }
        else {
            return {
                status: false,
            };
        }
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
    getStorage(key) {
        const result = localStorage.getItem(key);
        if (result == null) {
            throw new Error(`Cannot find value where key is "${key}"`);
        }
        else {
            return String(result);
        }
    }
    check(key) {
        if (localStorage.getItem(key) != null) {
            return {
                status: true,
                target: this,
            };
        }
        else if (sessionStorage.getItem(key) != null) {
            return {
                status: true,
                target: this.unKeep(),
            };
        }
        else {
            return {
                status: false,
            };
        }
    }
}
export const eStorage = () => {
    return new ESession();
};
