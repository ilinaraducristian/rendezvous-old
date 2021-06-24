import {GlobalContext} from "../app/App.component";
import {useCallback, useRef, useState} from "react";
import ChannelSVG from "../../svg/Channel.svg";
import MembersSVG from "../../svg/Members.svg";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";

function ContentPanelComponent() {

  const [isMembersSelected, setIsMembersSelected] = useState(true);
  const inputRef = useRef(null);

  const onChange = useCallback((e) => {
    console.log(e.target.scrollHeight);
  }, []);

  const consumer = useCallback(props => {

    return (

        props.selectedChannel[0] === null ||
        <div className="content">
            <header className="content__header">
                <div className="content__header__main">
                    <ChannelSVG type={props.selectedChannel[0].type} isPrivate={false}/>
                    <span className="span__header-channel-name">{props.selectedChannel[0].name}</span>
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
                    <footer className="content__footer">
                        <button type="button" className="btn">
                            <PlusSVG/>
                        </button>
                        <textarea className="input__content-footer"
                                  placeholder={`Message #${props.selectedChannel[0].name}`} onChange={onChange}>

                        </textarea>
                      {/*<text ref={inputRef} type="text" className="input__content-footer"*/}
                      {/*       placeholder={`Message #${props.selectedChannel[0].name}`}*/}
                      {/*       onChange={onChange}*/}
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
                    membri
                </div>
              }
            </div>
        </div>
    );

  }, [isMembersSelected]);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );

}

{/*<ol className="members">*/
}
{/*  {*/
}
{/*    members.filter((member: Member) => member.server_id === selectedServer?.id)*/
}
{/*        .map((member: Member) => users.get(member.user_id) as User)*/
}
{/*        .map((user: User) =>*/
}
{/*            <MemberComponent name={user.firstName}/>*/
}
{/*        )*/
}
{/*  }*/
}
{/*</ol>*/
}
export default ContentPanelComponent;