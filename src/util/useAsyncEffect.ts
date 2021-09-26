import {DependencyList, useEffect} from "react";

function useAsyncEffect(effect: Function, deps?: DependencyList) {
    return useEffect(() => {
        (async () => {
            await effect();
        })();
        // eslint-disable-next-line
    }, deps);
}

export default useAsyncEffect;