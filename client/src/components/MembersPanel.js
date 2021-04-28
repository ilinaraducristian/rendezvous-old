import React from "react";

function MembersPanel({members}) {
    const elements = [];
    members?.forEach((member, id) => {
        elements.push(
            <li key={`member_${id}`} className="member">
                {member.name}
            </li>
        );
    });
    return (
        <ul className="members" id="members">
            {elements}
        </ul>
    );
}

export default MembersPanel;
