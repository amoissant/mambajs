function MbaDomEmpty(){
    MbaDom.prototype.init.call(this, []);
}
MbaDomEmpty.prototype = new MbaDom();
MbaDomEmpty.prototype.constructor = MbaDomEmpty;
