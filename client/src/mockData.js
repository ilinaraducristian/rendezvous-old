export const mockUsers = new Map([['97a8ffc2-10cd-47dd-b915-cf8243d5bfc4', {
    id: '97a8ffc2-10cd-47dd-b915-cf8243d5bfc4',
    username: 'user1',
    firstName: 'Firstname',
    lastName: 'Lastname'
}]]);

const mockMessages = new Map([[1, {
    id: 1,
    timestamp: '16:04',
    sender: '97a8ffc2-10cd-47dd-b915-cf8243d5bfc4',
    text: 'mesaj 1'
}], [2, {
    id: 2,
    timestamp: '16:05',
    sender: '97a8ffc2-10cd-47dd-b915-cf8243d5bfc4',
    text: 'mesaj 2'
}], [3, {
    id: 3,
    timestamp: '16:06',
    sender: '97a8ffc2-10cd-47dd-b915-cf8243d5bfc4',
    text: 'mesaj 3'
}]]);

const mockGroups = new Map([[1, {
    id: 1, name: 'Text channels',
    channels: new Map([[1, {
        id: 1,
        type: 'text',
        name: 'general',
        messages: mockMessages
    }]])
}], [2, {
    id: 2, name: 'Voice channels',
    channels: new Map([[2, {
        id: 2,
        type: 'voice',
        name: 'General',
        messages: new Map()
    }]])
}]]);

export const mockServers = new Map([[1, {
    id: 1,
    name: 'servername',
    owner: '97a8ffc2-10cd-47dd-b915-cf8243d5bfc4',
    groups: mockGroups,
    channels: new Map([[3, {
        id: 3,
        type: 'text',
        name: 'gen2',
        messages: new Map()
    }]]),
    members: ['97a8ffc2-10cd-47dd-b915-cf8243d5bfc4']
}]]);
