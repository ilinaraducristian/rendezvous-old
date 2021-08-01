import styled from "styled-components";
import {MouseEventHandler} from "react";

export const Li = styled.li`
  display: flex;
  margin: 0.5em 0;
`;

type ComponentProps = {
  name: string,
  onSelectServer: MouseEventHandler<HTMLButtonElement>
}

function ServerComponent({name, onSelectServer: selectServer}: ComponentProps) {

  return (
      <Li className="li">
        <button className="btn btn__server" type="button" onClick={selectServer}>
          {name[0]}
        </button>
      </Li>
  );

}

export default ServerComponent;