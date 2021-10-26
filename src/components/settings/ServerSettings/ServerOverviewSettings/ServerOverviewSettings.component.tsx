import styles from "./ServerOverviewSettings.module.css";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {mockImage} from "mock-data";
import {updateServerImage} from "providers/socketio";
import fileToDataUrl from "util/file-to-data-url";
import {ChangeEvent} from "react";
import {updateServerImage as updateServerImageAction} from "state-management/slices/data/data.slice";

function ServerOverviewSettingsComponent() {

    const selectedServer = useAppSelector(selectSelectedServer);
    const dispatch = useAppDispatch();

    async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
        const {files} = event.target;
        if (files === null) return;
        const file = files.item(0);
        if (file === null) return;
        const image = await fileToDataUrl(file) || "";
        const serverId = selectedServer?.id ?? -1;
        await updateServerImage({serverId, image});
        dispatch(updateServerImageAction({serverId, image}));
    }

    return (
        <div className={styles.div}>
            <h3>Server Overview</h3>
            <div className={styles.buttonContainer}
                 style={{background: `no-repeat center/105% url(${selectedServer?.image ?? mockImage})`}}>
                <input type="file" id="image-input" accept="image/png, image/jpeg" hidden onChange={uploadImage}/>
                <label htmlFor="image-input">CHANGE<br/>ICON</label>
            </div>
        </div>
    );
}

export default ServerOverviewSettingsComponent;