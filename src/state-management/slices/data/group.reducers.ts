import {DataSliceState} from "state-management/slices/data/data.slice";
import {selectSelectedServer} from "../../selectors/data.selector";

const groupReducers = {
    moveGroups(state: DataSliceState, {payload}: { payload: { id: number, order: number }[] }) {
        const server = selectSelectedServer({data: state});
        if (server === undefined) return;

        payload.forEach(group => {
            const found = server.groups.find(gr => gr.id === group.id);
            if (found === undefined) return;
            found.order = group.order;
        });

    },
};

export default groupReducers;