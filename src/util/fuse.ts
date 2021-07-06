class Fuse {

  private _state: boolean = false;

  get state(): boolean {
    return this._state;
  }

  blow() {
    this._state = true;
  }

}

export default Fuse;