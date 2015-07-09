if (typeof Object.create !== "function") {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

var Model = {
  inherited: function () {},
  created: function () {
    this.records = {};
  },

  prototype: {
    init: function () {}
  },

  create: function () {
    var object = Object.create(this);
    // console.log(object.__proto__ === this);
    // console.log(this,object);
    object.parent = this;
    object.prototype = object.fn = Object.create(this.prototype);

    object.created();
    this.inherited(object);
    return object;
  },

  init: function () {
    var instance = Object.create(this.prototype);
    // console.log(instance.__proto__ === this);
    // console.log(this,instance);
    instance.parent = this;
    instance.init.apply(instance, arguments);
    return instance;
  },

  extend: function (o) {
    var extended = o.extended;
    jQuery.extend(this, o);
    if (extended) {
      extended(this);
    }
  },

  include: function (o) {
    var included = o.included;
    jQuery.extend(this.prototype, o);
    if (included) {
      included();
    }
  }
};

// 添加对象属性
jQuery.extend(Model, {
  find: function () {}
});

// 添加实例属性
jQuery.extend(Model.prototype, {
  init: function (attrs) {
    if (attrs) {
      this.load(attrs);
    }
  },
  load: function (attributes) {
    var name;
    for (name in attributes) {
      this[name] = attributes[name];
    }
  }
});

Math.guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, 
    v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
};

Model.extend({
  find: function (id) {
    if (!this.records[id]) {
      throw ("Unknow record");
    }
    return this.records[id];
  },

  populate: function (values) {
    this.records = {};
    var i, il = values.length;
    for (i = 0; i < il; i += 1) {
      this.init(values[i]).save();
    }
  }
});

Model.include({
  newRecord: true,
  dup: function () {
    return jQuery.extend(true, {}, this);
  },
  create: function () {
    if (!this.id) {
      this.id = Math.guid();
    }
    this.newRecord = false;
    this.parent.records[this.id] = this.dup();
  },
  update: function () {
    this.parent.records[this.id] = this.dup();
  },
  destroy: function () {
    delete this.parent.records[this.id];
  },
  save: function () {
    this.newRecord ? this.create() : this.update();
  }
});


var Asset = Model.create();
var User = Model.create();

var user1 = User.init({id: 1, name: 'caogen'});
var user2 = User.init({name: 'QJX'});
user1.save();
console.log(user1, user2);
console.log(User.find(1));
// user2.save();
console.log(User.find(2));

jQuery.getJSON('/path/to/file', {param1: 'value1'}, function (json, textStatus) {
  User.populate(json);
});