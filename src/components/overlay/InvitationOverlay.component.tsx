import {useCallback, useState} from "react";
import {setOverlay} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import OverlayComponent from "components/overlay/Overlay.component";
import styled from "styled-components";
import {selectSelectedServer} from "../../state-management/selectors/data.selector";
import XSVG from "../../svg/X.svg";

type ComponentProps = {
    invitation: string
}

function InvitationOverlayComponent({invitation}: ComponentProps) {

    const selectedServer = useAppSelector(selectSelectedServer)
    const [status, setStatus] = useState("Copy");
    const dispatch = useAppDispatch();

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(invitation);
            setStatus("Copied");
        } catch (e) {
            console.error(e);
            setStatus("Error");
        }
    }, [invitation]);

    function close() {
        dispatch(setOverlay(null));
    }

    return (
        <OverlayComponent>
            <Container>
                <FirstRow>
                    <Span1>INVITE FRIENDS TO {selectedServer?.name}</Span1>
                    <button className="btn" type="button" onClick={close}><XSVG/></button>
                </FirstRow>
                <H5>SEND A SERVER INVITE LINK TO A FRIEND</H5>
                <ThirdRow>
                    <Span1>{invitation}</Span1>
                    <Button type="button" className="btn" onClick={copyToClipboard}>{status}</Button>
                </ThirdRow>
            </Container>
        </OverlayComponent>
    );

}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const FirstRow = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  width: 100%;
  align-items: start;
`
const ThirdRow = styled.div`
  display: flex;
  background-color: var(--color-16th);
  padding: .7em;
  align-items: center;
`
const Span1 = styled.span`
  flex-grow: 1;
  color: white;
`

const H5 = styled.h5`
  color: white;
  margin: 0;
  margin-bottom: .5em;
  padding: 0;
`

const Button = styled.button`
  background-color: var(--color-17th);
  border-color: var(--color-17th);
  border-style: solid;
  //border: 1em solid var(--color-17th);
  border-radius: 0.1em;
  border-bottom: 10em;
  border-top: 2em;
  width: 5em;
  height: 2.5em;
`

export default InvitationOverlayComponent;
