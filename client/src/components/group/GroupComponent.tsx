import {useState} from "react";

function GroupComponent({name, children}: { name: string, children: any }) {

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
