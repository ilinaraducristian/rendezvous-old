import ChannelSVG from "svg/Channel/Channel.svg";
import MembersSVG from "svg/Members/Members.svg";
import styled from "styled-components";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectFriendRequests, selectHeader, selectSelectedChannel} from "state-management/selectors/data.selector";
import {HeaderTypes, OverlayTypes, ThirdPanelTypes} from "types/UISelectionModes";
import {setOverlay, setThirdPanel} from "state-management/slices/data/data.slice";
import {ChannelType} from "dtos/channel.dto";
import FriendSVG from "svg/Friend/Friend.svg";

function HeaderComponent() {

    const [isMembersSelected, setIsMembersSelected] = useState(true);

    const dispatch = useAppDispatch();
    const selectedChannel = useAppSelector(selectSelectedChannel);
    const header = useAppSelector(selectHeader);
    const [tab, setTab] = useState<ThirdPanelTypes>(ThirdPanelTypes.allFriends);
    const friendRequests = useAppSelector(selectFriendRequests);

    function selectOnline() {
        setTab(ThirdPanelTypes.onlineFriends)
    }

    function selectAll() {
        setTab(ThirdPanelTypes.allFriends)
        dispatch(setThirdPanel(ThirdPanelTypes.allFriends));
    }

    function selectPending() {
        setTab(ThirdPanelTypes.pendingFriendRequests)
        dispatch(setThirdPanel(ThirdPanelTypes.pendingFriendRequests));
    }

    function addFriend() {
        dispatch(setOverlay({type: OverlayTypes.AddFriendOverlayComponent}));
    }

    return (
        <Header>
            <DivHeader>
                {
                    header !== HeaderTypes.friends ||
                    <>
                        <FriendSVG/>
                        <FriendsSpan>Friends</FriendsSpan>
                        <Button type="button"
                                className={tab === ThirdPanelTypes.onlineFriends ? "btn selected-tab" : "btn"}
                                onClick={selectOnline}>Online</Button>
                        <Button type="button"
                                className={`btn ${tab === ThirdPanelTypes.allFriends ? "selected-tab" : ""}`}
                                onClick={selectAll}>All</Button>
                        <PendingButton type="button"
                                       className={tab === ThirdPanelTypes.pendingFriendRequests ? "btn selected-tab" : "btn"}
                                       onClick={selectPending}>
                            <span>Pending</span>
                            {
                                friendRequests.length === 0 ||
                                <Badge>{friendRequests.length}</Badge>
                            }
                        </PendingButton>
                        <AddFriendButton type="button" className="btn" onClick={addFriend}>Add Friend</AddFriendButton>
                    </>
                }
                {
                    header !== HeaderTypes.channel || selectedChannel === undefined ||
                    <>
                        <ChannelSVG type={ChannelType.Text} isPrivate={false}/>
                        <Span>{selectedChannel.name}</Span>
                        <button type="button"
                                className={`btn ${isMembersSelected ? "btn--active" : "btn--off"} btn--hover`}
                                onClick={() => setIsMembersSelected(!isMembersSelected)}>
                            <MembersSVG/>
                        </button>
                    </>
                }
            </DivHeader>
            <DivMembers>
            </DivMembers>
        </Header>
    );
}

/* CSS */

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 48px;
  min-height: 48px;
  box-shadow: var(--small-shadow-bar);
  z-index: 0;
  background-color: var(--color-2nd);
`;

const Button = styled.button`
  color: var(--color-11th);
  font-size: 1rem;

  &:hover {
    background-color: var(--color-14th);
    color: var(--color-7th);
  }
`;

const PendingButton = styled.button`
  color: var(--color-11th);
  font-size: 1rem;

  &:hover {
    background-color: var(--color-14th);
    color: var(--color-7th);
  }

  display: flex;
  justify-content: center;
  align-items: center;
`

const AddFriendButton = styled.button`
  background-color: var(--color-18th);
  border: solid var(--color-18th);
  border-radius: 0.3em;
  border-width: 0.1em 0.3em;
`;

const Badge = styled.span`
  background-color: var(--color-19th);
  border-radius: 50%;
  border-width: 0.5em;
  color: white;
  flex-grow: 1;
  width: 1em;
  height: 1em;
  margin-left: 0.4em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Span = styled.span`
  flex-grow: 1;
`;

const FriendsSpan = styled.span`
  color: var(--color-6th);
`;

const DivMembers = styled.div`
  width: var(--members-panel-width);
`;

const DivHeader = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 1em;
`;

/* CSS */

export default HeaderComponent;