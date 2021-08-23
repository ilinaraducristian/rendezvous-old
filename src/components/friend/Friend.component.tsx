import User from "types/User";
import styled from "styled-components";

type ComponentProps = {
  user: User
}

function FriendComponent({user}: ComponentProps) {

  return (
      <Li>{user.username}</Li>
  );

}

/* CSS */

const Li = styled.li`
  color: white;
  cursor: pointer;
`;

/* CSS */

export default FriendComponent;