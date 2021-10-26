import styles from './ServerRolesSettings.module.css';
import ButtonComponent from "components/ButtonComponent";
import Arrow3SVG from "svg/Arrow3/Arrow3.svg";
import XSVG from "svg/XSVG/X.svg";
import {useEffect, useState} from "react";
import {Role} from "dtos/role.dto";
import {useAppSelector} from "state-management/store";
import {selectSelectedServer} from "state-management/selectors/data.selector";
import {changePermissions as socketioChangePermissions} from 'providers/socketio';

type ComponentProps = {
    goBack: () => void,
    selectedRoleIndex: number,
}

function ServerDefaultRolesSettingsComponent({goBack, selectedRoleIndex}: ComponentProps) {

    const selectedServer = useAppSelector(selectSelectedServer);
    const [role, setRole] = useState<Role>();
    const [permissions, setPermissions] = useState<{ name: string, isChecked: boolean, description: string }[]>([]);

    useEffect(() => {
        if (selectedServer === undefined) return;
        setRole(selectedServer.roles[selectedRoleIndex]);
        setPermissions(roleToPermissions({...selectedServer.roles[selectedRoleIndex]}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function newRole() {

    }

    function onChange(index: number) {
        permissions[index].isChecked = !permissions[index].isChecked;
        setPermissions([...permissions]);
    }

    function savePermissions() {
        if (role === undefined) return;
        socketioChangePermissions({
            role: {
                ...role,
                renameServer: permissions[0].isChecked,
                createInvitation: permissions[1].isChecked,
                deleteServer: permissions[2].isChecked,
                createChannels: permissions[3].isChecked,
                createGroups: permissions[4].isChecked,
                deleteChannels: permissions[5].isChecked,
                deleteGroups: permissions[6].isChecked,
                moveChannels: permissions[7].isChecked,
                moveGroups: permissions[8].isChecked,
                readMessages: permissions[9].isChecked,
                writeMessages: permissions[10].isChecked
            }
        }).then();
    }

    return (
        <div className={styles.container}>
            <div className={styles.firstPanel}>
                <div className={styles.header}>
                    <ButtonComponent onClick={goBack} className={styles.backButton}>
                        <Arrow3SVG className={styles.arrowSvg}/>
                        <span>BACK</span>
                    </ButtonComponent>
                    <ButtonComponent onClick={newRole} className={styles.newRoleButton}>
                        <XSVG className={styles.xSvg}/>
                    </ButtonComponent>
                </div>
                <ul className={`list ${styles.ul}`}>
                    {
                        selectedServer?.roles.map((role, index) => (
                            <li key={`role_${index}`}>
                                <ButtonComponent onClick={() => setRole(role)}>
                                    {role.name}
                                </ButtonComponent>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className={styles.separator}/>
            {
                role === undefined ||
                <div className={styles.secondPanel}>
                    <h3>EDIT ROLE — {role.name}</h3>
                    <ul className="list">
                        {
                            permissions.map((permission, index) => (
                                <li key={`permission_${index}`}>
                                    <h5>{permission.name}</h5>
                                    <input type="checkbox" checked={permission.isChecked}
                                           onChange={() => onChange(index)}/>
                                    <h5>{permission.description}</h5>
                                </li>
                            ))
                        }
                    </ul>
                    <ButtonComponent>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent onClick={savePermissions}>
                        Save
                    </ButtonComponent>
                </div>
            }
        </div>
    );
    // <div className={styles.div}>
    // <h3>Roles</h3>
    // <ButtonComponent className={styles.defaultPermissionsButton} onClick={changeDefaultPermissions}>
    // <PeopleSVG className={styles.peopleSvg}/>
    // <h4 className={styles.title}>Default Permissions</h4>
    // <h5 className={styles.subtitle}>applied to all server members</h5>
    // <ArrowSVG className={styles.arrowSvg}/>
    // </ButtonComponent>
    // </div>
}

function roleToPermissions(role: Role) {
    return [
        {
            name: 'Rename Server',
            isChecked: role.renameServer,
            description: 'Allows members to rename the server'
        },
        {
            name: 'Create Invitation',
            isChecked: role.createInvitation,
            description: 'Allows members to create invitations for this server'
        },
        {
            name: 'Delete Server',
            isChecked: role.deleteServer,
            description: 'Allows members to delete this server'
        },
        {
            name: 'Create Channels',
            isChecked: role.createChannels,
            description: 'Allows members to create channels in this server'
        },
        {
            name: 'Create Groups',
            isChecked: role.createGroups,
            description: 'Allows members to create groups in this server'
        },
        {
            name: 'Delete Channels',
            isChecked: role.deleteChannels,
            description: 'Allows members to delete channels in this server'
        },
        {
            name: 'Delete Groups',
            isChecked: role.deleteGroups,
            description: 'Allows members to delete groups in this server'
        },
        {
            name: 'Move Channels',
            isChecked: role.moveChannels,
            description: 'Allows members to move channels in this server'
        },
        {
            name: 'Move Groups',
            isChecked: role.moveGroups,
            description: 'Allows members to move groups in this server'
        },
        {
            name: 'Read Messages',
            isChecked: role.readMessages,
            description: 'Allows members to read messages in this server'
        },
        {
            name: 'Write Messages',
            isChecked: role.writeMessages,
            description: 'Allows members to write messages in this server'
        }
    ]
}

export default ServerDefaultRolesSettingsComponent;