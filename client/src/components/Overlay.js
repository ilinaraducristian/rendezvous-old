function Overlay({overlay, onClose: close}) {
    return (
        <div className="overlay-container">
            <div className="overlay-holder">
                <button type="button" className="overlay-close-button transparent-button" onClick={close}>X</button>
                <h1>{overlay.title}</h1>
                <h3>{overlay.description}</h3>
                {overlay.content}
            </div>
        </div>
    );
}

export default Overlay;
