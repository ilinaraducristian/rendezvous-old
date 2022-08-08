export default class DuplicateEmailError extends Error{
  constructor() {
    super('duplicate email error');
  }
}