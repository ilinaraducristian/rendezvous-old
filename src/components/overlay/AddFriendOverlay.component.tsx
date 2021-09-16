import {addFriendRequest, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import {useEffect, useRef} from "react";
import {useLazySendFriendRequestQuery} from "../../state-management/apis/socketio.api";

function AddFriendOverlayComponent() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const [fetch, {data, isSuccess}] = useLazySendFriendRequestQuery();

    function sendFriendRequest() {
        if (ref.current === null) return;
        fetch({username: ref.current.value});
        // dispatch(setOverlay({type: OverlayTypes.CreateServerOverlayComponent}));
    }

    useEffect(() => {
        if (!isSuccess || data === undefined) return;
        dispatch(addFriendRequest({id: data.id, userId: data.userId, incoming: false}))
        dispatch(setOverlay(null));
    }, [isSuccess, data, dispatch])

    return (
        <OverlayComponent>
            <h1 className="h1">Friend username</h1>
            <input type="text" ref={ref}/>
            <button type="button" className="btn btn__overlay-select" onClick={sendFriendRequest}>
                Send friend request
            </button>
        </OverlayComponent>
    );

}

export default AddFriendOverlayComponent;