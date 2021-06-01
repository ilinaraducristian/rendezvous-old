import {useCallback} from "react";
import AddServerOverlay from "./AddServerOverlay.js";

function Overlay({type, title, description, onClose: close, children}) {

    const renderChildren = useCallback(() => {
        switch (type) {
            case 'addServer':
                return <AddServerOverlay/>;
            default:
                return null;
        }
    }, [])

    return (
        <div className="overlay-container">
            <div className="overlay-holder">
                <button type="button" className="overlay-close-button transparent-button" onClick={close}>X</button>
                <h1>{title}</h1>
                <h3>{description}</h3>
                {renderChildren()}
            </div>
        </div>
    );
}

export default Overlay;
