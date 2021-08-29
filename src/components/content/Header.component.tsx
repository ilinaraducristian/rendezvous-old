import ChannelSVG from "../../svg/Channel.svg";
import {ChannelType} from "../../types/Channel";
import MembersSVG from "../../svg/Members.svg";
import styled from "styled-components";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {selectHeader, selectSelectedChannel} from "../../state-management/selectors/data.selector";
import {HeaderTypes, OverlayTypes, ThirdPanelTypes} from "../../types/UISelectionModes";
import {setOverlay, setThirdPanel} from "../../state-management/slices/data/data.slice";

function HeaderComponent() {

    const [isMembersSelected, setIsMembersSelected] = useState(true);

    const dispatch = useAppDispatch();
    const selectedChannel = useAppSelector(selectSelectedChannel);
    const header = useAppSelector(selectHeader);

    function selectAll() {
        dispatch(setThirdPanel(ThirdPanelTypes.allFriends));
    }

    function selectPending() {
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
                    <span>Friends</span>
                    <button type="button" onClick={selectAll}>All</button>
                    <button type="button" onClick={selectPending}>Pending</button>
                    <button type="button" onClick={addFriend}>Add Friend</button>
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
`;

/* CSS */

export default HeaderComponent;