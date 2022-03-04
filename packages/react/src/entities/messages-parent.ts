import { computed, makeObservable, observable } from "mobx";
import { fetchAuthApi } from "../api";
import OrderedMap from "../ordered-map";
import Message from "./message";

abstract class MessagesParent<M extends Message> {
  id: string;
  messages: OrderedMap<string, M> = new OrderedMap();
  _isInitialized: boolean = false;
  private hasFirstMessage: boolean = false;
  private isGettingMessages: boolean = false;
  protected readonly url: string;

  constructor(id: string, url: string) {
    this.id = id;
    this.url = url;
    makeObservable(this, {
      id: observable,
      messages: observable,
      _isInitialized: observable,
      isInitialized: computed,
    });
  }

  get isInitialized() {
    return this._isInitialized;
  }

  set isInitialized(isInitialized: boolean) {
    this._isInitialized = isInitialized;
  }

  addMessage(message: M) {
    this.messages.set(message.id, message, true);
  }

  async apiDelete() {
    await fetchAuthApi(this.url, {method: "DELETE"});
  }

  async apiNewMessage(text: string, files: string[] = []) {
    await fetchAuthApi(`${this.url}/messages`, {method: "POST", body: { text, files }});
  }

  abstract apiGetMessages(offset?: number): Promise<[string, M][]>;

  async apiGetInitialMessages() {
    if (this.isGettingMessages) return;
    this.isGettingMessages = true;
    const messages = await this.apiGetMessages();
    if (messages.length < 30) this.hasFirstMessage = true;
    this.messages = new OrderedMap(messages);
    this.isInitialized = true;
    this.isGettingMessages = false;
  }

  async apiGetMoreMessages() {
    if (this.isGettingMessages || this.hasFirstMessage) return;
    this.isGettingMessages = true;
    const messages = await this.apiGetMessages(this.messages.size);
    if (messages.length < 30) this.hasFirstMessage = true;
    this.messages.setMultiple(messages);
    this.isGettingMessages = false;
  }
}

export default MessagesParent;
