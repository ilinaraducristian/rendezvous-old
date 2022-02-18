import { makeAutoObservable } from "mobx";
import Channel from "../entities/channel";
import Friendship from "../entities/friendship";
import Server from "../entities/server";
import Overlays from "../Overlays";

class RootState {
  private _selectedServer: Server | null = null;
  private _selectedChannel: Channel | null = null;
  private _selectedFriendship: Friendship | null = null;

  private _overlay: [Overlays] | [Overlays, any] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get selectedServer() {
    return this._selectedServer;
  }

  get selectedChannel() {
    return this._selectedChannel;
  }

  get selectedFriendship() {
    return this._selectedFriendship;
  }

  get overlay() {
    return this._overlay;
  }

  set selectedServer(server: Server | null) {
    this._selectedServer = server;
    this._selectedChannel = null;
    this._selectedFriendship = null;
  }

  set selectedChannel(channel: Channel | null) {
    this._selectedChannel = channel;
  }

  set selectedFriendship(friendship: Friendship | null) {
    this._selectedFriendship = friendship;
  }

  set overlay(overlay: [Overlays] | [Overlays, any] | null) {
    this._overlay = overlay;
  }
}

export const rootState = new RootState();

export default RootState;
