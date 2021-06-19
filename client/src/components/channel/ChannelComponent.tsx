function ChannelComponent({
                            id,
                            name,
                            onSelectChannel: selectChannel
                          }: { id: number, name: string, onSelectChannel: Function }) {

  return (
      <div id="channel-container">
        <button type="button" onClick={() => selectChannel(id, name)}>{name}</button>
      </div>
  );
}

export default ChannelComponent;
