import TransparentBackgroundDiv from "./TransparentBackgroundDiv";
import styled from "styled-components";
import XSVG from "../../svg/X.svg";
import {useState} from "react";
import RadioSVG from "../../svg/Radio.svg";
import ChannelSVG from "../../svg/Channel.svg";
import {ChannelType} from "../../dtos/channel.dto";

const UniversalButton = styled.button``;
if (UniversalButton.defaultProps !== undefined) {
    if (UniversalButton.defaultProps.type !== undefined)
        UniversalButton.defaultProps.type = "button";
    if (UniversalButton.defaultProps.className !== undefined)
        UniversalButton.defaultProps.className = "btn";
}

function NewOverlayComponent() {

    const [channelType, setChannelType] = useState(ChannelType.Text);
    const [channelName, setChannelName] = useState('');

    return (
        <TransparentBackgroundDiv>
            <div>
                <Body>
                    <Button className="btn" type="button">
                        <XSVG/>
                    </Button>
                    <H2>Create {channelType === ChannelType.Voice ? "Voice" : "Text"} Channel</H2>
                    <H5>in Text Channels</H5>
                    <ChannelSpan>CHANNEL TYPE</ChannelSpan>
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
                    <ChannelSpan>CHANNEL NAME</ChannelSpan>
                    <InputContainer>
                        <ChannelSVG type={channelType} isPrivate={false} style={{width: "16px", height: "16px"}}/>
                        <Input placeholder="new-channel" onChange={event => setChannelName(event.target.value)}/>
                    </InputContainer>
                </Body>
                <Footer>
                    <CancelButton type="button" className="btn">
                        Cancel
                    </CancelButton>
                    <CreateButton type="button" disabled={channelName.trim().length === 0}
                                  className={"btn" + (channelName.trim().length === 0 ? " btn--disabled" : "")}>
                        Create Channel
                    </CreateButton>
                </Footer>
            </div>
        </TransparentBackgroundDiv>
    );
}

/* CSS */

const CancelButton = styled.button`

  margin-right: 32px;
  height: 100%;

  &:hover {
    text-decoration: underline;
  }

`;

const CreateButton = styled.button`
  padding: 2px 16px;
  background-color: var(--color-29th);
  transition: background-color 300ms;
  border: 0;
  border-radius: 3px;
  height: 100%;

  ${props => props.disabled ? "" : `
  &:hover {
    background-color: var(--color-30th);
  }
  `}

`;

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
  padding: 0;
`;

const Button = styled(UniversalButton)`
  position: absolute;
  top: 16px;
  right: 12px;
  color: var(--color-11th);
  transition: opacity .2s;
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
  margin-bottom: 20px;
`;

const ChannelSpan = styled.span`
  align-self: start;
  font-size: 12px;
  margin-top: 12px;
  margin-bottom: 8px;
  margin-left: 16px;
`;

const TextChannelButton = styled.button<{ checked: boolean }>`

  width: 408px;
  height: 56px;
  background-color: ${props => props.checked ? "var(--color-1st)" : "var(--color-3rd)"};
  color: var(--color-8th);
  padding: 10px;
  column-gap: 8px;
  margin-bottom: 8px;
  border: 0;
  border-radius: 3px;

  display: grid;
  grid-template:
    "radio svg h4"
      "radio svg h5"
      / auto auto 1fr;
  justify-items: start;
  align-items: center;

  ${props => !props.checked ?
          `&:hover {
    color: var(--color-7th);
    background-color: var(--color-14th);
  }`
          : ""
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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--color-24th);
  width: 408px;
  height: 40px;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid var(--color-25th);
  transition: border-color .2s ease-in-out;

  &:hover {
    border-color: var(--color-26th);
  }

  &:focus-within {
    border-color: var(--color-27th);
  }

`;

const Input = styled.input`
  outline: none;
  background: none;
  border: none;
  color: var(--color-28th);
  width: 100%;
`;

const Footer = styled.footer`
  width: 440px;
  height: 70px;
  background-color: var(--color-3rd);
  padding: 16px;
  border: 0;
  border-radius: 0 0 5px 5px;
  display: flex;
  align-items: center;
  justify-content: end;
`;

/* CSS */

export default NewOverlayComponent;