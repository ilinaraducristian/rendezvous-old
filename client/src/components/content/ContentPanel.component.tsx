import {GlobalContext} from "../app/App.component";
import {useCallback, useState} from "react";
import ChannelSVG from "../../svg/Channel.svg";
import MembersSVG from "../../svg/Members.svg";
import PlusSVG from "../../svg/Plus.svg";

function ContentPanelComponent() {

  const [isMembersSelected, setIsMembersSelected] = useState(true);

  const consumer = useCallback(props => {

    return (

        props.selectedChannel[0] === null ||
        <div className="content">
            <header className="content__header">
                <>
                    <ChannelSVG type={props.selectedChannel[0].type} isPrivate={false}/>
                    <span>{props.selectedChannel[0].name}</span>
                    <button type="button" className="btn" onClick={() => setIsMembersSelected(!isMembersSelected)}>
                        <MembersSVG/>
                    </button>
                </>
            </header>
            <div className="content__body">
                <div className="content__body__main">
                    <div className="content__body__messages">mesaje</div>
                    <footer className="content__footer">
                        <button type="button" className="btn">
                            <PlusSVG/>
                        </button>
                        <input type="text" className="input__content-footer"
                               placeholder={`Message #${props.selectedChannel[0].name}`}/>
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