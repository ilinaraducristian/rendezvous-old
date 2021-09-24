import TransparentBackgroundDiv from "./TransparentBackgroundDiv";
import styled from "styled-components";
import XSVG from "../../svg/X.svg";
import {useState} from "react";
import RadioSVG from "../../svg/Radio.svg";
import ChannelSVG from "../../svg/Channel.svg";
import {ChannelType} from "../../dtos/channel.dto";

function NewOverlayComponent() {

    const [channelType, setChannelType] = useState(ChannelType.Text);

    return (
        <TransparentBackgroundDiv>
            <div>
                <Body>
                    <Button className="btn" type="button">
                        <XSVG/>
                    </Button>
                    <H2>Create {channelType === ChannelType.Voice ? "Voice" : "Text"} Channel</H2>
                    <H5>in Text Channels</H5>
                    <ChannelTypeSpan>CHANNEL TYPE</ChannelTypeSpan>
                    <TextChannelButton className="btn" onClick={() => setChannelType(ChannelType.Text)}
                                       checked={channelType === ChannelType.Text}>
                        <RadioSVG style={{gridArea: 'radio'}} checked={channelType === ChannelType.Text}/>
                        <ChannelSVG type={ChannelType.Text} isPrivate={false} style={{gridArea: "svg"}}/>
                        <TextChannelH4>Text Channel</TextChannelH4>
                        <TextChannelH5>Post images, GIFs, stickers, opinions and puns</TextChannelH5>
                    </TextChannelButton>
                    <TextChannelButton className="btn" onClick={() => setChannelType(ChannelType.Voice)}
                                       checked={channelType === ChannelType.Voice}>
                        <RadioSVG style={{gridArea: 'radio'}} checked={channelType === ChannelType.Voice}/>
                        <ChannelSVG type={ChannelType.Voice} isPrivate={false} style={{gridArea: "svg"}}/>
                        <TextChannelH4>Voice Channel</TextChannelH4>
                        <TextChannelH5>Hang out with voice, video and screen sharing</TextChannelH5>
                    </TextChannelButton>
                </Body>
                <Footer>

                </Footer>
            </div>
        </TransparentBackgroundDiv>
    );
}

/* CSS */

const Body = styled.div`
  width: 440px;
  height: 450px;
  background-color: var(--color-2nd);
  border: 0;
  border-radius: 5px 5px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--color-6th);
  align-items: center;
`;

const Button = styled.button`
  position: absolute;
  top: 16px;
  right: 12px;
  color: var(--color-11th);
  transition: opacity .2s ease-in-out;
  opacity: .5;

  &:hover {
    opacity: 1;
  }

`;

const css = `
  width: max-content;
  margin: 0;
`;

const H2 = styled.h2`
  ${css};
  margin-top: 32px;
`;

const H5 = styled.h5`
  ${css};
  color: gray;
`;

const ChannelTypeSpan = styled.span`
  align-self: start;
  font-size: 12px;
`;

const TextChannelButton = styled.button<{ checked: boolean }>`

  width: 408px;
  height: 56px;
  background-color: ${props => props.checked ? "var(--color-1st)" : "var(--color-3rd)"};
  color: var(--color-8th);
  //display: flex;
  //justify-content: start;
  //align-items: center;

  display: grid;
  grid-template:
    "radio svg h4"
      "radio svg h5"
      / auto auto 1fr;
  justify-items: start;
  align-items: center;

  &:hover {
    color: var(--color-7th);
    background-color: var(--color-14th);
  }
`;

const TextChannelH4 = styled.h4`
  grid-area: h4;
  margin: 0;
  padding: 0;
  align-self: end;
`;

const TextChannelH5 = styled.h5`
  grid-area: h5;
  margin: 0;
  padding: 0;
  align-self: start;
`;

const Footer = styled.footer`
  width: 440px;
  height: 70px;
  background-color: var(--color-3rd);
  padding: 16px;
  border: 0;
  border-radius: 0 0 5px 5px;
`;

/* CSS */

export default NewOverlayComponent;