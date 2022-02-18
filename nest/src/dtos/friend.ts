import Message from "./message";

type Friend = {
  id: number;
  userId: string;
  messages: Message[];
};

export default Friend;
