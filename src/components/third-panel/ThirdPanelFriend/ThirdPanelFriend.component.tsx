import {User} from "dtos/user.dto";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import {FriendRequest} from "dtos/friend.dto";
import {useCallback} from "react";
import CheckSVG from "svg/Check/Check.svg";
import XSVG from "svg/XSVG/X.svg";
import {acceptFriendRequest, rejectFriendRequest} from "providers/socketio";
import ButtonComponent from "components/ButtonComponent";
import styles from "./ThirdPanelFriend.module.css";

type ComponentProps = {
    user: User,
    friendRequest?: FriendRequest
}

function ThirdPanelFriendComponent({user, friendRequest}: ComponentProps) {

    const acceptFriendRequestCallback = useCallback((userId: string, friendRequestId: number) => {
        acceptFriendRequest({friendRequestId}).then();
    }, []);

    const rejectFriendRequestCallback = useCallback((userId: string, friendRequestId: number) => {
        rejectFriendRequest({friendRequestId}).then();
    }, []);

    return (
        <li className={styles.li}>
            <div className={`btn ${styles.div}`}>
                <AvatarWithStatusSVG/>
                <div className={styles.div2}>
                    <span>{user.firstName} {user.lastName}</span>
                    {
                        friendRequest === undefined ||
                        <span>{
                            friendRequest.incoming ?
                                <span className={styles.span}>Incoming friend request</span>
                                :
                                <span className={styles.span}>Outgoing friend request</span>
                        }</span>
                    }
                </div>
                {
                    friendRequest === undefined || !friendRequest.incoming ||
                    <>
                        <ButtonComponent className={`${styles.button} ${styles.buttonAccept}`}
                                         onClick={() => acceptFriendRequestCallback(friendRequest.userId, friendRequest.id)}>
                            <CheckSVG/>
                        </ButtonComponent>
                        <ButtonComponent className={`${styles.button} ${styles.buttonReject}`}
                                         onClick={() => rejectFriendRequestCallback(friendRequest.userId, friendRequest.id)}>
                            <XSVG/>
                        </ButtonComponent>
                    </>
                }
            </div>
        </li>
    );
}

export default ThirdPanelFriendComponent;