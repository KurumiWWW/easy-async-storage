var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.check(key);
            if (res.status) {
                return (_a = res.target) === null || _a === void 0 ? void 0 : _a.getStorage(key);
            }
            else {
                throw new Error(`Cannot find value where key is "${key}"`);
            }
        });
    }
    asyncGet(key, timeout = DEFAULT_OUT_TIME, step = DEFAULT_STEP) {
        return new Promise((resolve, reject) => {
            let counter = 0;
            let timer = setInterval(() => {
                this.get(key).then((result) => {
                    counter += step;
                    if (result) {
                        clearInterval(timer);
                        counter = 0;
                        resolve(result);
                    }
                    else if (counter >= timeout) {
                        reject(new Error(`Cannot find value where key is "${key}"`));
                    }
                });
            }, step);
        });
    }
    check(key) {
        return new Promise((resolve, reject) => {
            if (sessionStorage.getItem(key) != null) {
                resolve({
                    status: true,
                    target: this,
                });
            }
            else if (localStorage.getItem(key) != null) {
                resolve({
                    status: true,
                    target: this.stateTrigger(),
                });
            }
            else {
                reject({
                    status: false,
                });
            }
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
    stateTrigger() {
        return this.keep();
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
}
class ELocal extends AbstractEStorage {
    constructor() {
        super(...arguments);
        this.storage = localStorage;
    }
    unKeep() {
        return new ESession();
    }
    stateTrigger() {
        return this.unKeep();
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
}
export const eStorage = () => {
    // return new ESession();
    const e = new ESession();
    return {
        keep: () => e.keep(),
        set: (key, value) => e.set(key, value),
        get: (key) => e.get(key),
        asyncGet: (key, timeout, step) => e.asyncGet(key, timeout, step),
        check: (key) => e.check(key),
    };
};
