function MbaDomEmpty(){
    this._dom = [];
}
MbaDomEmpty.prototype = new MbaDom();
MbaDomEmpty.prototype.constructor = MbaDomEmpty;
