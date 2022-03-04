import { ChannelTypeDto } from "@rendezvous/common";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import Group from "../../entities/group";
import RootState from "../../state/root-state";

type ComponentProps = {
  rootState: RootState;
  group: Group;
};

const AddChannelOverlayComponent = observer(({ rootState, group }: ComponentProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const textOptionRef = useRef<HTMLInputElement>(null);

  async function addChannel() {
    if (nameRef.current === null || textOptionRef.current === null) return;
    await group.apiNewChannel(nameRef.current.value, textOptionRef.current.checked ? ChannelTypeDto.text : ChannelTypeDto.voice);
    rootState.overlay = null;
  }

  return (
    <div>
      <span>name</span>
      <input type="text" ref={nameRef} />
      <span>type</span>
      <div>
        <input type="radio" value="text" name="type" defaultChecked ref={textOptionRef} /> Text
        <input type="radio" value="voice" name="type" /> Voice
      </div>
      <button type="button" onClick={addChannel}>
        New Channel
      </button>
    </div>
  );
});

export default AddChannelOverlayComponent;
