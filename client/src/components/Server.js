export default function Server({id, name, onServerSelect: selectServer}) {
    return (
        <li>
            <button onClick={() => selectServer(id)}>{name[0]}</button>
        </li>
    );
}
