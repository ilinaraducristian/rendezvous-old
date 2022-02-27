import { observer } from "mobx-react-lite";
import { KeyboardEvent } from "react";
import { ChannelType } from "../../dtos/channel";
import Channel from "../../entities/channel";
import RootState from "../../state/root-state";

type ComponentProps = { rootState: RootState; channel: Channel };

const ChannelComponent = observer(({ rootState, channel }: ComponentProps) => {
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (channel.type === ChannelType.voice) return;
          rootState.selectedChannel = channel;
        }}
      >
        {channel.name}
      </button>
      {!rootState.isShiftPressed || (
        <button
          type="button"
          onClick={() => {
            channel.apiDelete();
          }}
        >
          -C
        </button>
      )}
    </li>
  );
});

export default ChannelComponent;
