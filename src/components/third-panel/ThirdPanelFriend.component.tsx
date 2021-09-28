import {User} from "dtos/user.dto";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import styled from "styled-components";
import {FriendRequest} from "dtos/friend.dto";
import {useCallback} from "react";
import CheckSVG from "svg/Check/Check.svg";
import XSVGSvg from "svg/XSVG/XSVG.svg";
import {acceptFriendRequest, rejectFriendRequest} from "socketio/ReactSocketIOProvider";

type ComponentProps = {
    user: User,
    friendRequest?: FriendRequest
}

function ThirdPanelFriendComponent({user, friendRequest}: ComponentProps) {

    const acceptFriendRequestCallback = useCallback((userId: string, friendRequestId: number) => {
        acceptFriendRequest({friendRequestId}).then();
    }, []);

    const rejectFriendRequestCallback = useCallback((userId: string, friendRequestId: number) => {
        rejectFriendRequest({friendRequestId}).then();
    }, []);

    return (
        <Li>
            <Div className="btn">
                <AvatarWithStatusSVG/>
                <Div2>
                    <span>{user.firstName} {user.lastName}</span>
                    {
                        friendRequest === undefined ||
                        <span>{
                            friendRequest.incoming ?
                                <Span>Incoming friend request</Span>
                                :
                                <Span>Outgoing friend request</Span>
                        }</span>
                    }
                </Div2>
                {
                    friendRequest === undefined || !friendRequest.incoming ||
                    <>
                        <Button type="button" className="btn" acceptOrReject={true}
                                onClick={() => acceptFriendRequestCallback(friendRequest.userId, friendRequest.id)}>
                            <CheckSVG/>
                        </Button>
                        <Button type="button" className="btn" acceptOrReject={false}
                                onClick={() => rejectFriendRequestCallback(friendRequest.userId, friendRequest.id)}>
                            <XSVGSvg/>
                        </Button>
                    </>
                }
            </Div>
        </Li>
    )
}

const Li = styled.li`
  margin: 1em 0 1em 1em;
  width: calc(100% - 1em);

  &:hover {
    background-color: var(--color-14th);
  }

`;

const Div = styled.div`
  width: 100%;
  height: 100%;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  padding: 1em 1em 1em 1em;
`;

const Span = styled.span`
  color: var(--color-8th);
`;

const Div2 = styled.div`
  flex-grow: 1;
  text-align: start;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button<{ acceptOrReject: boolean }>`
  background-color: var(--color-3rd);
  border: var(--color-3rd) solid;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 0.5em;

  &:hover > svg {
    color: ${props => props.acceptOrReject ? "var(--color-18th)" : "var(--color-19th)"};
  }

`

export default ThirdPanelFriendComponent;