import {DependencyList, useEffect} from "react";

const promise = Promise.resolve();

function useAsyncEffect(effect: Function, deps?: DependencyList) {
    return useEffect(() => {
        promise.then(() => effect());
        // eslint-disable-next-line
    }, deps);
}

export default useAsyncEffect;