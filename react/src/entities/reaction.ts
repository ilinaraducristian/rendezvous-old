import ReactionDto from "../dtos/reaction";

class Reaction {
  id: string;
  userId: string;
  serverEmoji?: boolean;
  emoji: string;

  constructor(reactionDto: ReactionDto) {
    this.id = reactionDto.id;
    this.userId = reactionDto.userId;
    this.serverEmoji = reactionDto.serverEmoji;
    this.emoji = reactionDto.emoji;
  }
}

export default Reaction;
