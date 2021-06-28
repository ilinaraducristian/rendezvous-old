import {GlobalStates} from "../../global-state";
import {useContext, useMemo, useState} from "react";
import ChannelSVG from "../../svg/Channel.svg";
import MembersSVG from "../../svg/Members.svg";
import {ChannelType} from "../../types";
import MembersPanelComponent from "../member/MembersComponent";
import MessagesPanelComponent from "../message/MessagesPanel.component";

function ContentPanelComponent() {

  const [isMembersSelected, setIsMembersSelected] = useState(true);
  const {state} = useContext(GlobalStates);

  return useMemo(() =>
          <div className="content">
            <header className="content__header">
              <div className="content__header__main">
                {
                  state.selectedChannel === null ||
                  <ChannelSVG type={ChannelType.Text} isPrivate={false}/>
                }
                <span className="span__header-channel-name">{state.selectedChannel?.name}</span>
                <button type="button" className="btn" onClick={() => setIsMembersSelected(!isMembersSelected)}>
                  <MembersSVG/>
                </button>
              </div>
              <div className="content__header__members">
                placeholder
              </div>
            </header>
            <div className="content__body">
              <MessagesPanelComponent/>
              {
                !isMembersSelected ||
                <MembersPanelComponent/>
              }
            </div>
          </div>
      , [isMembersSelected, state.selectedChannel]);

}

/*<ol className="members">*/

/*  {*/

/*    members.filter((member: Member) => member.server_id === selectedServer?.id)*/

/*        .map((member: Member) => users.get(member.user_id) as User)*/

/*        .map((user: User) =>*/

/*            <MemberComponent name={user.firstName}/>*/

/*        )*/

/*  }*/

/*</ol>*/

export default ContentPanelComponent;