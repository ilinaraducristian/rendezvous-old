import {DataSliceState} from "state-management/slices/data/data.slice";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import Group from "types/Group";
import Member from "types/Member";

export const selectSelectedServerGroups = ({data}: { data: DataSliceState }): Group[] => {
  const selectedServer = selectSelectedServer({data});
  if (selectedServer === undefined) return [];
  return selectedServer.groups;
};

export const selectSelectedServerMembers = ({data}: { data: DataSliceState }): Member[] => {
  const selectedServer = selectSelectedServer({data});
  if (selectedServer === undefined) return [];
  return selectedServer.members;
};