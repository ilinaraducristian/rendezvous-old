import { observer } from "mobx-react-lite";
import { useRef } from "react";
import RootState from "../../state/root-state";

type ComponentProps = {
  rootState: RootState;
};

const AddGroupOverlayComponent = observer(({ rootState }: ComponentProps) => {
  const nameRef = useRef<HTMLInputElement>(null);

  async function addGroup() {
    if (nameRef.current === null) return;
    await rootState.selectedServer?.apiNewGroup(nameRef.current.value);
    rootState.overlay = null;
  }

  return (
    <div>
      <span>name</span>
      <input type="text" ref={nameRef} />
      <button type="button" onClick={addGroup}>
        New Group
      </button>
    </div>
  );
});

export default AddGroupOverlayComponent;
