import { observer } from "mobx-react-lite";
import { useRef } from "react";
import RootState from "../../state/root-state";
import ApiCallButton from "../ApiCallButton.component";
import "./AddGroupOverlay.component.css";

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

  function closeOverlay() {
    rootState.overlay = null;
  }

  return (
    <div>
      <header>
        <button type="button" onClick={closeOverlay}>X</button>
        <h2>Create Group</h2>
      </header>
      <form>
        <label htmlFor="name-ref">Group Name:</label>
        <input type="text" ref={nameRef} name="name-ref" />
      </form>
      <footer>
      <ApiCallButton type="submit" api={addGroup}>
          New Group
      </ApiCallButton>
      </footer>
    </div>
  );
});

export default AddGroupOverlayComponent;
