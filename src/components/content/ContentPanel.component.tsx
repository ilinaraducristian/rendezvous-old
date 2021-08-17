import {useState} from "react";
import ChannelSVG from "svg/Channel.svg";
import MembersSVG from "svg/Members.svg";
import {useAppSelector} from "state-management/store";
import MessagesPanelComponent from "components/message/MessagesPanel.component";
import MembersPanelComponent from "components/member/MembersPanel.component";
import {ChannelType} from "types/Channel";
import styled from "styled-components";
import {selectSelectedChannel} from "state-management/selectors";

function ContentPanelComponent() {

  const [isMembersSelected, setIsMembersSelected] = useState(true);

  const selectedChannel = useAppSelector(selectSelectedChannel);

  return (
      <DivContainer>
        <Header>
          <DivHeader>
            {
              selectedChannel === undefined ||
              <>
                  <ChannelSVG type={ChannelType.Text} isPrivate={false}/>
                  <Span>{selectedChannel.name}</Span>
              </>
            }
            <button type="button" className={`btn ${isMembersSelected ? "btn--active" : "btn--off"} btn--hover`}
                    onClick={() => setIsMembersSelected(!isMembersSelected)}>
              <MembersSVG/>
            </button>
          </DivHeader>
          <DivMembers>
            placeholder
          </DivMembers>
        </Header>
        <DivContentBody>
          <MessagesPanelComponent/>
          {
            !isMembersSelected ||
            <MembersPanelComponent/>
          }
        </DivContentBody>
      </DivContainer>
  );

}

/* CSS */

const Span = styled.span`
  flex-grow: 1;
`;

const DivContainer = styled.div`
  flex-grow: 1;
  background-color: var(--color-secondary);
  color: white;
  display: flex;
  flex-direction: column;
`;

const DivMembers = styled.div`
  width: var(--members-panel-width);
`;

const DivContentBody = styled.div`
  display: flex;
  flex-grow: 1;
  max-height: calc(100% - 3em);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 3em;
  box-shadow: var(--small-shadow-bar);
`;

const DivHeader = styled.div`
  flex-grow: 1;
  display: flex;
`;

/* CSS */

export default ContentPanelComponent;