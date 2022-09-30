var plugin = function (options) {
  var seneca = this;

  seneca.add({ role: "product", cmd: "add" }, function (print, respond) {
    this.make("product").data$(print.data).save$(respond);
  });

  seneca.add({ role: "product", cmd: "get-all" }, function (print, respond) {
    this.make("product").list$({}, respond);
  });

  seneca.add({ role: "product", cmd: "delete" }, function (print, respond) {
    this.make("product").remove$(print.id, respond);
  });
};

module.exports = plugin;
