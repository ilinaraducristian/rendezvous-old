import { Injectable } from "@nestjs/common";
import EmojiDTO from "../dtos/emoji";
import UpdateEmojiRequest from "../dtos/requests/update-emoji-request";
import { EmojiNotFoundException } from "../exceptions/NotFoundExceptions";
import { ServersService } from "./servers.service";

@Injectable()
export class EmojisService {
  constructor(private readonly serversService: ServersService) {}

  async createEmojis(userId: string, serverId: string, emojis: EmojiDTO[]) {
    const server = await this.serversService.getById(userId, serverId);
    server.emojis.push(...emojis);
    await server.save();
  }

  async updateEmoji(userId: string, serverId: string, emojiId: string, emojiUpdate: UpdateEmojiRequest) {
    const server = await this.serversService.getById(userId, serverId);
    const foundEmoji = server.emojis.find((emoji) => emoji._id.toString() === emojiId);
    if (foundEmoji === undefined) throw new EmojiNotFoundException();
    if (foundEmoji.alias !== emojiUpdate.alias || foundEmoji.md5 !== emojiUpdate.md5) {
      foundEmoji.alias = emojiUpdate.alias;
      foundEmoji.md5 = emojiUpdate.md5;
      await server.save();
    }
  }

  async deleteEmoji(userId: string, serverId: string, emojiId: string) {
    const server = await this.serversService.getById(userId, serverId);
    const index = server.emojis.findIndex((emoji) => emoji._id.toString() === emojiId);
    if (index === -1) throw new EmojiNotFoundException();
    server.emojis.splice(index, 1);
    await server.save();
  }
}
