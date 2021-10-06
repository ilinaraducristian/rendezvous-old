import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./AddFriendOverlay.module.css";
import {useState} from "react";
import {useAppDispatch} from "state-management/store";
import {addFriendRequest, setOverlay} from "state-management/slices/data/data.slice";
import {sendFriendRequest} from "providers/ReactSocketIO.provider";

function AddFriendOverlayComponent() {

    const [username, setUsername] = useState("");
    const dispatch = useAppDispatch();

    async function sendFriendRequestCallback() {
        const data = await sendFriendRequest({username});
        dispatch(addFriendRequest({id: data.id, userId: data.userId, incoming: false}));
        dispatch(setOverlay(null));
    }

    function closeOverlay() {
        dispatch(setOverlay(null));
    }

    return (
        <TransparentBackgroundDivComponent>
            <div className={styles.body}>
                <ButtonComponent className={styles.styledButton} onClick={closeOverlay}>
                    <XSVG/>
                </ButtonComponent>
                <header className={styles.header}>
                    <h2 className={styles.h2}>Add friend</h2>
                    <h5 className={styles.h5}>You can add a friend with their username</h5>
                </header>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        placeholder="Enter a username"
                        onChange={event => setUsername(event.target.value.trim())}
                    />
                    <ButtonComponent
                        disabled={username.length === 0}
                        className={`${styles.createButton} ${username.length === 0 ? styles.createButtonDisabled : ""}`}
                        onClick={sendFriendRequestCallback}
                    >
                        Send Friend Request
                    </ButtonComponent>
                </div>
            </div>
        </TransparentBackgroundDivComponent>
    );
}

export default AddFriendOverlayComponent;