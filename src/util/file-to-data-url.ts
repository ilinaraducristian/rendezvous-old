async function fileToDataUrl(file: File) {
    const fr = new FileReader();
    const promise = new Promise<void | string>(resolve => {
        fr.onloadend = () => {
            if (fr.result === null || typeof fr.result !== "string") resolve();
            resolve(fr.result as string);
        };
    })
    fr.readAsDataURL(file);
    return promise;
}

export default fileToDataUrl;