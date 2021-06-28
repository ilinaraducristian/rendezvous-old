import {GlobalStates} from "../../global-state";
import {useCallback, useContext, useMemo, useState} from "react";
import ChannelSVG from "../../svg/Channel.svg";
import MembersSVG from "../../svg/Members.svg";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";

function ContentPanelComponent() {

  const [isMembersSelected, setIsMembersSelected] = useState(true);
  const {state} = useContext(GlobalStates);

  const sendMessage = useCallback(e => {
    let message: string;
    if (e.code.includes("Enter"))
      message = (e.target as any).innerText;
  }, []);

  return useMemo(() => {
    if (state.selectedChannel === null) return null;
    return (
        <div className="content">
          <header className="content__header">
            <div className="content__header__main">
              <ChannelSVG type={state.selectedChannel.type} isPrivate={false}/>
              <span className="span__header-channel-name">{state.selectedChannel.name}</span>
              <button type="button" className="btn" onClick={() => setIsMembersSelected(!isMembersSelected)}>
                <MembersSVG/>
              </button>
            </div>
            <div className="content__header__members">

            </div>
          </header>
          <div className="content__body">
            <div className="content__body__main">
              <div className="content__body__messages">mesaje</div>
              <footer
                  className="content__footer"
              >
                <button type="button" className="btn">
                  <PlusSVG/>
                </button>
                <span className="span__input-message"
                      role="textbox"
                      contentEditable
                      onKeyUp={sendMessage}
                />
                {/*<textarea*/}
                {/*    style={{height: '100%'}}*/}
                {/*    className="input__content-footer"*/}
                {/*    placeholder={`Message #${state.selectedChannel.name}`}*/}
                {/*    onChange={onChange}*/}
                {/*/>*/}
                <button type="button" className="btn">
                  <GIFSVG/>
                </button>
                <button type="button" className="btn btn__emoji"/>
              </footer>
            </div>
            {
              !isMembersSelected ||
              <div className="content__body__members">
                  membrii
              </div>
            }
          </div>
        </div>
    );
  }, [isMembersSelected, sendMessage, state.selectedChannel]);

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