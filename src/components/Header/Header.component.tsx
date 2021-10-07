import ChannelSVG from "svg/Channel/Channel.svg";
import MembersSVG from "svg/Members/Members.svg";
import styles from "./Header.module.css";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectFriendRequests, selectHeader, selectSelectedChannel} from "state-management/selectors/data.selector";
import {HeaderTypes, OverlayTypes, ThirdPanelTypes} from "types/UISelectionModes";
import {setOverlay, setThirdPanel} from "state-management/slices/data/data.slice";
import {ChannelType} from "dtos/channel.dto";
import FriendSVG from "svg/Friend/Friend.svg";
import ButtonComponent from "components/ButtonComponent";

function HeaderComponent() {

    const [isMembersSelected, setIsMembersSelected] = useState(true);

    const dispatch = useAppDispatch();
    const selectedChannel = useAppSelector(selectSelectedChannel);
    const header = useAppSelector(selectHeader);
    const [tab, setTab] = useState<ThirdPanelTypes>(ThirdPanelTypes.allFriends);
    const friendRequests = useAppSelector(selectFriendRequests);

    function selectOnline() {
        setTab(ThirdPanelTypes.onlineFriends);
    }

    function selectAll() {
        setTab(ThirdPanelTypes.allFriends);
        dispatch(setThirdPanel(ThirdPanelTypes.allFriends));
    }

    function selectPending() {
        setTab(ThirdPanelTypes.pendingFriendRequests);
        dispatch(setThirdPanel(ThirdPanelTypes.pendingFriendRequests));
    }

    function addFriend() {
        dispatch(setOverlay({type: OverlayTypes.AddFriendOverlayComponent}));
    }

    return (
        <header className={styles.header}>
            <div className={styles.divHeader}>
                {
                    header !== HeaderTypes.friends ||
                    <>
                        <FriendSVG/>
                        <span className={styles.friendsSpan}>Friends</span>
                        <ButtonComponent
                            className={`${styles.button} ${tab === ThirdPanelTypes.onlineFriends ? "selected-tab" : ""}`}
                            onClick={selectOnline}>Online</ButtonComponent>
                        <ButtonComponent
                            className={`${styles.button} ${tab === ThirdPanelTypes.allFriends ? "selected-tab" : ""}`}
                            onClick={selectAll}>All</ButtonComponent>
                        <ButtonComponent
                            className={`${styles.pendingButton} ${tab === ThirdPanelTypes.pendingFriendRequests ? "selected-tab" : ""}`}
                            onClick={selectPending}>
                            <span>Pending</span>
                            {
                                friendRequests.length === 0 ||
                                <span className={styles.badge}>{friendRequests.length}</span>
                            }
                        </ButtonComponent>
                        <ButtonComponent className={styles.addFriendButton} onClick={addFriend}>Add
                            Friend</ButtonComponent>
                    </>
                }
                {
                    header !== HeaderTypes.channel || selectedChannel === undefined ||
                    <>
                        <ChannelSVG type={ChannelType.Text} isPrivate={false}/>
                        <span className={styles.span}>{selectedChannel.name}</span>
                        <ButtonComponent
                            className={`btn ${isMembersSelected ? "btn--active" : "btn--off"} btn--hover`}
                            onClick={() => setIsMembersSelected(!isMembersSelected)}>
                            <MembersSVG/>
                        </ButtonComponent>
                    </>
                }
            </div>
            <div className={styles.divMembers}>
            </div>
        </header>
    );
}

export default HeaderComponent;