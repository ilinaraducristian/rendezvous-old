import React from "react";

function MembersPanel({members}) {
    const elements = [
        (<li className="member-container">

        </li>)
    ];
    members?.forEach((member, id) => {
        elements.push(
            <li key={`member_${id}`} className="member">
                {member.name}
            </li>
        );
    });
    return (
        <ul id="members-panel">
            {elements}
        </ul>
    );
}

export default MembersPanel;
