import {useState} from "react";

type ComponentProps = {
  name: string,
  children: any
}

function GroupComponent({name, children}: ComponentProps) {

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
      <div id="group-container">
        <button id="group-button" onClick={() => setIsCollapsed(!isCollapsed)}>{name}</button>
        {
          isCollapsed ||
          <ul id="group-list">{children}</ul>
        }
      </div>
  );
}

export default GroupComponent;
