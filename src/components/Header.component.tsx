import ChannelSVG from "../svg/Channel.svg";
import MembersSVG from "../svg/Members.svg";
import styled from "styled-components";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../state-management/store";
import {selectHeader, selectSelectedChannel} from "../state-management/selectors/data.selector";
import {HeaderTypes, OverlayTypes, ThirdPanelTypes} from "../types/UISelectionModes";
import {setOverlay, setThirdPanel} from "../state-management/slices/data/data.slice";
import {ChannelType} from "../dtos/channel.dto";
import FriendSVG from "../svg/Friend.svg";

function HeaderComponent() {

    const [isMembersSelected, setIsMembersSelected] = useState(true);

    const dispatch = useAppDispatch();
    const selectedChannel = useAppSelector(selectSelectedChannel);
    const header = useAppSelector(selectHeader);
    const [tab, setTab] = useState<ThirdPanelTypes>(ThirdPanelTypes.allFriends)

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

    return <Header>
        <DivHeader>
            {
                header !== HeaderTypes.friends ||
                <>
                    <FriendSVG/>
                    <span>Friends</span>
                    <Button type="button" className={tab === ThirdPanelTypes.onlineFriends ? "selected-tab" : ""}
                            onClick={selectOnline}>Online</Button>
                    <Button type="button" className={tab === ThirdPanelTypes.allFriends ? "selected-tab" : ""}
                            onClick={selectAll}>All</Button>
                    <Button type="button"
                            className={tab === ThirdPanelTypes.pendingFriendRequests ? "selected-tab" : ""}
                            onClick={selectPending}>Pending</Button>
                    <Button type="button" onClick={addFriend}>Add Friend</Button>
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
            placeholder
        </DivMembers>
    </Header>
}

/* CSS */

const Button = styled.button`
  background: none;
  color: var(--color-11th);
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: var(--color-14th);
    color: var(--color-7th);
  }
`

const Span = styled.span`
  flex-grow: 1;
`;

const DivMembers = styled.div`
  width: var(--members-panel-width);
`;

const Header = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  height: 3em;
  box-shadow: var(--small-shadow-bar);
  z-index: 0;
  color: white;
  background-color: var(--color-secondary);
`;

const DivHeader = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 1em;
`;

/* CSS */

export default HeaderComponent;