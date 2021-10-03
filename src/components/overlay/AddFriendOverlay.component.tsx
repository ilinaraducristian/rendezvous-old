import {addFriendRequest, setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay/Overlay.component";
import {useRef} from "react";
import {sendFriendRequest} from "providers/ReactSocketIO.provider";

function AddFriendOverlayComponent() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);


    async function sendFriendRequestCallback() {
        if (ref.current === null) return;
        const data = await sendFriendRequest({username: ref.current.value});
        dispatch(addFriendRequest({id: data.id, userId: data.userId, incoming: false}));
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent title="Friend username">
            <input type="text" ref={ref}/>
            <button type="button" className="btn btn__overlay-select" onClick={sendFriendRequestCallback}>
                Send friend request
            </button>
        </OverlayComponent>
    );

}

export default AddFriendOverlayComponent;