import {DependencyList, useEffect} from "react";

function useAsyncEffect(effect: Function, deps?: DependencyList) {
    return useEffect(() => {
        (async () => {
            await effect();
        })();
    }, deps);
}

export default useAsyncEffect;