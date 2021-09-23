import styled from "styled-components";
import {SecondPanelHeaderTypes} from "../../types/UISelectionModes";
import {useAppSelector} from "../../state-management/store";
import {selectSecondPanelHeader, selectSelectedServer} from "../../state-management/selectors/data.selector";
import {Dispatch, SetStateAction} from "react";
import {ArrowXSVG} from "../../svg/Arrow.svg";
import FriendSVG from "../../svg/Friend.svg";

type ComponentProps = {
    isDropdownShown: boolean,
    setIsDropdownShown: Dispatch<SetStateAction<boolean>>;
}

function SecondPanelHeaderComponent({isDropdownShown, setIsDropdownShown}: ComponentProps) {

    const selectedServer = useAppSelector(selectSelectedServer);
    const secondPanelHeader = useAppSelector(selectSecondPanelHeader);

    function toggleDropdown() {
        if (selectedServer === undefined) return;
        setIsDropdownShown(!isDropdownShown);
    }

    return (
        <SecondPanelHeader>
            {
                secondPanelHeader !== SecondPanelHeaderTypes.channel || selectedServer === undefined ||
                <Button className="btn" type="button" onClick={toggleDropdown}>
                    <Span>{selectedServer.name}</Span>
                    <ArrowXSVG isCollapsed={!isDropdownShown}/>
                </Button>
            }
            {
                secondPanelHeader !== SecondPanelHeaderTypes.friends ||
                <FriendsButton type="button" className="btn">
                    <FriendSVG/>
                    <Span>Friends</Span>
                </FriendsButton>
            }
        </SecondPanelHeader>
    )
}

const SecondPanelHeader = styled.header`
  width: 100%;
  border-style: none;
  box-shadow: var(--small-shadow-bar);
  height: 48px;
  min-height: 48px;
`

const Span = styled.span`
  flex-grow: 1;
  color: white;
`;

const Button = styled.button`
  background: none;
  font-size: 24px;
  text-align: left;
  width: 100%;

  border-style: none;
  box-shadow: var(--small-shadow-bar);
  display: flex;
  align-items: center;
  height: 32px;
  color: var(--color-9th)
`;



const FriendsButton = styled.button`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 18px;
  gap: 8px;
  margin-left: 16px;
`;
export default SecondPanelHeaderComponent;