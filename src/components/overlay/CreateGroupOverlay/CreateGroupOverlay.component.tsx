import TransparentBackgroundDivComponent
    from "components/overlay/TransparentBackgroundDiv/TransparentBackgroundDiv.component";
import ButtonComponent from "components/ButtonComponent";
import XSVG from "svg/XSVG/X.svg";
import styles from "./CreateGroupOverlay.module.css";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import config from "config";
import {createGroup} from "providers/ReactSocketIO.provider";
import {setOverlay} from "state-management/slices/data/data.slice";

function CreateGroupOverlayComponent() {

    const [groupName, setGroupName] = useState("");
    const selectedServer = useAppSelector(selectSelectedServer);
    const dispatch = useAppDispatch();

    async function createGroupCallback() {
        if (config.offline) return;
        if (selectedServer === undefined) return;
        await createGroup({serverId: selectedServer.id, groupName});
        // const groupName = ref.current?.value as string;
        // dispatch(setGroup({
        //   id: data.groupId,
        //   serverId: selectedServer.id,
        //   name: groupName
        // }));
    }

    function closeOverlay() {
        dispatch(setOverlay(null));
    }

    return (
        <TransparentBackgroundDivComponent>
            <div>
                <div className={styles.body}>
                    <ButtonComponent className={styles.styledButton} onClick={closeOverlay}>
                        <XSVG/>
                    </ButtonComponent>
                    <header className={styles.header}>
                        <h2 className={styles.h2}>Create Group</h2>
                    </header>
                    <span className={styles.groupSpan}>GROUP NAME</span>
                    <div className={styles.inputContainer}>
                        <input className={styles.input} placeholder="New Group"
                               onChange={event => setGroupName(event.target.value)}/>
                    </div>
                </div>
                <footer className={styles.footer}>
                    <ButtonComponent className={styles.cancelButton}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent
                        disabled={groupName.trim().length === 0}
                        className={`${styles.createButton} ${groupName.trim().length === 0 ? styles.createButtonDisabled : ""}`}
                        onClick={createGroupCallback}
                    >
                        Create Group
                    </ButtonComponent>
                </footer>
            </div>
        </TransparentBackgroundDivComponent>
    );
}

export default CreateGroupOverlayComponent;