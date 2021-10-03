import {useRef} from "react";
import config from "config";

import {useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {createGroup} from "socketio/ReactSocketIOProvider";

function CreateGroupOverlayComponent() {

    const ref = useRef<HTMLInputElement>(null);
    const selectedServer = useAppSelector(selectSelectedServer);

    async function createGroupCallback() {
        if (config.offline) return;
        if (selectedServer === undefined) return;
        const groupName = ref.current?.value as string;
        await createGroup({serverId: selectedServer.id, groupName});
        // const groupName = ref.current?.value as string;
        // dispatch(setGroup({
        //   id: data.groupId,
        //   serverId: selectedServer.id,
        //   name: groupName
        // }));
    }

    return (
        <OverlayComponent>
            <h1 className="h1">Group name</h1>
            <input type="text" ref={ref}/>
            <button type="button" className="btn btn__overlay-select" onClick={createGroupCallback}>Create
            </button>
        </OverlayComponent>
    );
}

export default CreateGroupOverlayComponent;