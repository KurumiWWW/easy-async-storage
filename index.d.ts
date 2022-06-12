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
declare abstract class AbstractEStorage implements EStorage {
    abstract storage: Storage;
    abstract check(key: string): CheckResult;
    abstract getStorage(key: string): string;
    set(key: string, value: string): EStorage;
    get(key: string): string;
    asyncGet(key: string, timeout?: number, step?: number): Promise<string>;
}
declare class ESession extends AbstractEStorage {
    storage: Storage;
    keep(): EStorage;
    getStorage(key: string): string;
    check(key: string): CheckResult;
}
export declare const eStorage: () => ESession;
export {};
