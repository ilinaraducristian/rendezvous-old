import {DependencyList, useCallback} from "react";

export function debounce<T extends (...args: any[]) => any>(func: T): (...funcArgs: Parameters<T>) => Promise<ReturnType<T>> {
    let working: boolean = false;

    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        if (working) return undefined as ReturnType<T>;
        working = true;
        const result = await func(...args);
        working = false;
        return result;
    };
}

export const useCallbackDebounced = <T extends (...args: any[]) => any>(func: T, deps: DependencyList) => useCallback(debounce(func), deps);