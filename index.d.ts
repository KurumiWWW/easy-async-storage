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
export declare const eStorage: () => {
    keep: () => EStorage;
    set: (key: string, value: string) => EStorage;
    get: (key: string) => Promise<any>;
    asyncGet: (key: string, timeout?: number | undefined, step?: number | undefined) => Promise<string>;
    check: (key: string) => Promise<CheckResult>;
};
export {};
