import Next from '../next.svg';
import AttachSVG from "../assets/attachSVG.js";
import GiftSVG from "../assets/giftSVG.js";
import GifSVG from "../assets/gifSVG.js";
import ChannelSVG from "../assets/channelSVG.js";
import MembersSVG from "../assets/membersSVG.js";
import NotificationsSVG from "../assets/notificationsSVG.js";
import PinnedSVG from "../assets/pinnedSVG.js";
import HelpSVG from "../assets/helpSVG.js";
import InboxSVG from "../assets/inboxSVG.js";

function ContentPanel({channel, messages, membersPanel}) {
    console.log(messages);
    return (
        <div id="content-panel">
            <div id="content-header">
                <div id="content-header-first-half">
                    {
                        channel &&
                        <ChannelSVG private={channel.isChannelPrivate} type={channel.channelType}/> &&
                        <h3>{channel.channelName}</h3>
                    }
                    <NotificationsSVG/>
                    <PinnedSVG/>
                    <MembersSVG/>
                </div>
                <div id="content-header-second-half">
                    <input type="text"/>
                    <InboxSVG/>
                    <HelpSVG/>
                </div>
            </div>
            <div id="content-body">
                <div id="messages-panel">
                    <div id="messages-body">
                        <ul className="ul--messages">
                            {
                                messages.map(message =>
                                    <li key={`message_${message.id}`} className="li--message">
                                        <span>{message.timestamp}</span>
                                        <span>{message.sender}</span>
                                        <span>{message.text}</span>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <div id="messages-footer">
                        <button type="button">
                            <AttachSVG/>
                        </button>
                        <input type="text"/>
                        <button type="button">
                            <GiftSVG/>
                        </button>
                        <button type="button">
                            <GifSVG/>
                        </button>
                        <button type="button" id="emoji-icon"/>
                    </div>
                </div>
                <ul id="members-panel">
                    <li className="member-container">
                        <img src={Next} alt="avatar"/>
                        <div id="member-info">
                            <div>
                                Reydw
                            </div>
                            {/*<div>Status</div>*/}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ContentPanel;
