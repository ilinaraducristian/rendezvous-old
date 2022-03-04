import { makeAutoObservable } from "mobx";
import Friendship from "../entities/friendship";
import OrderedMap from "../ordered-map";

export class FriendshipsState {
  _friendships: OrderedMap<string, Friendship> = new OrderedMap();

  constructor() {
    makeAutoObservable(this);
  }

  set friendships(friendships: OrderedMap<string, Friendship>) {
    this._friendships = friendships;
  }

  get friendships() {
    return this._friendships;
  }
}

export default new FriendshipsState();
