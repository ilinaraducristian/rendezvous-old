import {GlobalContext} from "../app/App.component";
import {useCallback, useState} from "react";
import GroupComponent from "../group/Group.component";
import {Group} from "../../types";
import ArrowXSVG from "../../svg/ArrowX.svg";
import ChannelsListComponent from "./ChannelsList.component";

function ChannelsPanelComponent() {

  const [isDropdownShown, setIsDropdownShown] = useState(false);

  const consumer = useCallback((
      {
        servers: [servers, setServers],
        channels: [channels, setChannels],
        groups: [groups, setGroups],
        overlay: [overlay, setOverlay],
        selectedServer: [selectedServer, setSelectedServer],
        selectedChannel: [selectedChannel, setSelectedChannel]
      }) => {

    return (
        <div className="channels-panel">
          <button className="btn btn__server-options" type="button"
                  onClick={() => setIsDropdownShown(!isDropdownShown)}>
            {
              selectedServer === null ||
              <>
                  <span className="svg__server-options-name">{selectedServer.name}</span>
                  <ArrowXSVG className={"svg__arrow" + (isDropdownShown ? " svg__arrow--active" : "")}/>
              </>
            }
          </button>
          <ol className="list list__panel list__channels-panel">
            <ChannelsListComponent/>
            {
              groups.filter((group: Group) => group.server_id === selectedServer?.id)
                  .map((group: Group) =>
                      <GroupComponent id={group.id} name={group.name}/>
                  )
            }
          </ol>
        </div>
    );

  }, [isDropdownShown]);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );

}

export default ChannelsPanelComponent;