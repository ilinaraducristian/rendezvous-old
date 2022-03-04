import { observer } from "mobx-react-lite";
import Server from "../../entities/server";
import { rootState } from "../../state/root-state";
import GroupComponent from "./Group.component";

type ComponentProps = { server: Server };

const GroupsComponent = observer(({ server }: ComponentProps) => {
  return (
    <>
      {server.groups.map((group) => (
        <GroupComponent key={group.id} rootState={rootState} group={group} />
      ))}
    </>
  );
});

export default GroupsComponent;
