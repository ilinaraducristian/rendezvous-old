import { ChannelTypeDto } from "@rendezvous/common";
import { observer } from "mobx-react-lite";
import Channel from "../../entities/channel";
import RootState from "../../state/root-state";

type ComponentProps = { rootState: RootState; channel: Channel };

const ChannelComponent = observer(({ rootState, channel }: ComponentProps) => {
  function selectChannel() {
    if (channel.type === ChannelTypeDto.voice) {
      channel.joinChannel();
      return;
    }
    rootState.selectedChannel = channel;
  }

  function deleteChannel() {
    channel.apiDelete();
  }

  if (channel.type === ChannelTypeDto.voice) console.log(channel.users);

  return (
    <li>
      <button type="button" onClick={selectChannel}>
        {channel.name}
      </button>
      {!rootState.isShiftPressed || (
        <button type="button" onClick={deleteChannel}>
          X
        </button>
      )}
      {channel.users?.length === 0 || (
        <ol>
          {channel.users?.map((userId) => (
            <li key={Math.random()}>{rootState.users.get(userId)?.username}</li>
          ))}
        </ol>
      )}
    </li>
  );
});

export default ChannelComponent;
