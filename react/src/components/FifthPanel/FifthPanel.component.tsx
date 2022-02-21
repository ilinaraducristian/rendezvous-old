import { observer } from "mobx-react-lite";
import RootState from "../../state/root-state";
import "./FifthPanel.component.css"

type ComponentProps = { rootState: RootState };

const FifthPanelComponent = observer(({ rootState }: ComponentProps) => {
  return (
    <>
      {rootState.selectedServer === null || (
        <ul className="fifth-panel">
          {rootState.selectedServer.members.map(member => (
            <li key={member.id}>{rootState.users.get(member.userId)?.username ?? member.userId}</li>
          ))}
        </ul>
      )}
    </>
  );
});

export default FifthPanelComponent;
