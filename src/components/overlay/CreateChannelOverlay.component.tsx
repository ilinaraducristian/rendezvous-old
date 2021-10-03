import {useRef} from "react";
import config from "config";

import {addChannel, selectChannel, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {ChannelType, TextChannel} from "dtos/channel.dto";
import {createChannel} from "socketio/ReactSocketIOProvider";

type ComponentProps = {
    groupId?: number | null
}

function CreateChannelOverlayComponent({groupId = null}: ComponentProps) {

    const ref = useRef<HTMLInputElement>(null);
    const selectedServer = useAppSelector(selectSelectedServer);

    const dispatch = useAppDispatch();

    async function createChannelCallback() {
        if (config.offline) return;
        if (selectedServer === undefined) return;
        // TODO
        const channelName = ref.current?.value as string;
        const data = await createChannel({serverId: selectedServer.id, groupId, channelName});
        const channel: TextChannel = {
            id: data?.channelId,
            serverId: selectedServer.id,
            groupId,
            type: ChannelType.Text,
            name: channelName,
            messages: [],
            order: 0,
        };
        dispatch(addChannel(channel));
        dispatch(selectChannel(channel.id));
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent>
            <h1 className="h1">Channel name</h1>
            <input type="text" ref={ref}/>
            <button type="button" className="btn btn__overlay-select" onClick={createChannelCallback}>Create
            </button>
        </OverlayComponent>
    );
}

export default CreateChannelOverlayComponent;