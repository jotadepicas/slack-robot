import Listener from './Listener';

export default class Listeners {
  constructor() {
    this._entries = [];
  }

  /**
   * @public
   * @param {string} type
   * @param {string|RegExp} value
   * @param {function (req, res)} callback
   * @return {Listener} listener
   */
  add(type, value, callback) {
    const entry = new Listener(type, value, callback);
    this._entries.push(entry);
    return entry;
  }

  /**
   * @public
   * @param {?string} id
   * @return {Array.<Listener>|?Listener} listener
   */
  get(id) {
    if (!id) {
      return this._entries;
    }

    for (let i = 0; i < this._entries.length; i++) {
      if (this._entries[i].id === id) {
        return this._entries[i];
      }
    }

    return null;
  }

  /**
   *
   * @public
   * @param {string} id
   * @return {boolean}
   */
  remove(id) {
    for (let i = 0; i < this._entries.length; i++) {
      if (this._entries[i].id === id) {
        this._entries.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  /**
   * @public
   * @param {Message} message
   * @return {?Listener} listener
   */
  find(message) {
    let value = '';
    const type = message.type;

    switch (type) {
      case 'message':
      if (message.subtype === 'file_share') {
          value = message.file && message.file.title;
          console.log('File share!', message.file.title);
        } else {
          value = message.value.text || message.attachments && message.attachments[0] && (message.attachments[0].title || message.attachments[0].text || '') ;
        }

        break;
      case 'reaction_added':
        value = message.value.emoji;
        break;
      default:
    }

    const entries = this._entries.filter(entry => entry.type === type);

    for (let i = 0; i < entries.length; i++) {
      // get first entry, or first match
      if (!entries[i].matcher || value.match(entries[i].matcher)) {
        return entries[i];
      }
    }

    return null;
  }
}
