import styled from "styled-components";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";

type ComponentProps = {
    name: string
}

function MemberComponent({name}: ComponentProps) {
    return (
        <Li>
            <Button type="button" className="btn">
                <AvatarWithStatusSVG/>
                <span>{name}</span>
            </Button>
        </Li>
    );
}

/* CSS */

const Li = styled.li`
`;

const Button = styled.button`
  color: var(--color-9th);
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  border: 0;
  border-radius: 4px;

  &:hover {
    color: var(--color-6th);
    background-color: var(--color-14th);
  }

`;

/* CSS */

export default MemberComponent;
