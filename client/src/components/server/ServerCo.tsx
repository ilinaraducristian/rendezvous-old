function ServerCo({id, name, onSelectServer: selectServer}: { id: number, name: string, onSelectServer: Function }) {
  return <div id="server-container">
    <button type="button" onClick={() => selectServer(id)}>{name}</button>
  </div>;
}

export default ServerCo;
