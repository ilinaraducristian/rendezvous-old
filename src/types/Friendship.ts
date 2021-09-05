import Message from "./Message";

type Friendship = {
    id: number,
    user1Id: string,
    user2Id: string,
    messages: Message[]
}

export default Friendship;