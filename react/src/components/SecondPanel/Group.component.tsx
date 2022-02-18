import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import Group from "../../entities/group";
import Overlays from "../../Overlays";
import RootState from "../../state/root-state";
import ChannelComponent from "../Channel.component";

type ComponentProps = { rootState: RootState; group: Group };

const GroupComponent = observer(({ rootState, group }: ComponentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const showNewChannelOverlay = useCallback(() => {
    rootState.overlay = [Overlays.addChannel, group];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteGroup = useCallback(() => {
    group.apiDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (group.order === 0)
    return (
      <>
        {group.channels.map((channel) => (
          <ChannelComponent key={channel.id} rootState={rootState} channel={channel} />
        ))}
      </>
    );

  return (
    <li>
      <div>
          <button type="button" onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
            {group.name}
          </button>
          <button type="button" onClick={showNewChannelOverlay}>
            +C
          </button>
          <button type="button" onClick={deleteGroup}>
            -G
          </button>
      </div>
      {isCollapsed || (
        <ol>
          {group.channels.map((channel) => (
            <ChannelComponent key={channel.id} rootState={rootState} channel={channel} />
          ))}
        </ol>
      )}
    </li>
  );
});

export default GroupComponent;
