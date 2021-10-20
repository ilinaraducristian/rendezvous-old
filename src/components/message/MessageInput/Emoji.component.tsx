type ComponentProps = {
    index: number,
    size?: number
}

function EmojiComponent({index, size}: ComponentProps) {
    let _size = size ?? 32;
    return (
        <div style={{
            background: "url(emojis1.png)",
            backgroundSize: `${_size * 42}px ${_size * 38}px`,
            width: _size,
            height: _size,
            backgroundPosition: `-${index % 42 * _size}px -${Math.floor(index / 42) * _size}px`,
        }}/>
    );
}

export default EmojiComponent;