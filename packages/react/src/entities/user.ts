import { UserDto } from "@rendezvous/common";
import { makeAutoObservable } from "mobx";

class User {
  private _id: string;
  private _username: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;

  constructor(userDto: UserDto) {
    this._id = userDto.id;
    this._username = userDto.username;
    this._firstName = userDto.firstName;
    this._lastName = userDto.lastName;
    this._email = userDto.email;
    makeAutoObservable(this);
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
}

export default User;
