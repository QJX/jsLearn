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
    this.attributes = [];
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
    var i, il = values.length;
    this.records = {};
    for (i = 0; i < il; i += 1) {
      this.init(values[i]).save();
    }
  },
  LocalStorage: {
    saveLocal: function (name) {
      var i, result = [];
      for (i in this.records) {
        result.push(this.records[i]);
      }
      localStorage.setItem(name, JSON.stringify(result));
    },
    loadLocal: function (name) {
      var result = JSON.parse(localStorage.getItem(name));
      this.populate(result);
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
    return this;
  },
  attributes: function () {
    var result = {}, attrs = this.parent.attributes;
    var i, attr, il = attrs.length;
    for (i = 0; i < il; i += 1) {
      attr = attrs[i];
      result[attr] = this[attr];
    }
    result.id = this.id;
    return result;
  },
  toJSON: function () {
    return (this.attributes());
  },
  createRemote: function (url, callback) {
    jQuery.post(url, this.attributes, callback);
  },
  updateRemote: function (url, callback) {
    jQuery.ajax({
      url: url,
      data: this.attributes,
      success: callback,
      type: "PUT"
    });
  }
});

//**************above is test code*****************

// var Asset = Model.create();
// var User = Model.create();

// var user1 = User.init({id: 1, name: 'caogen'});
// var user2 = User.init({name: 'QJX'});
// user1.save();
// console.log(user1, user2);
// console.log(User.find(1));
// // user2.save();
// console.log(User.find(2));

// jQuery.getJSON('/path/to/file', {param1: 'value1'}, function (json, textStatus) {
//   User.populate(json);
// });

var User = Model.create();
User.extend(Model.LocalStorage);
User.attributes = ['name', 'age', 'entry'];
var qjx = User.init({
  name: 'QJX',
  age: 25,
  entry: new Date(2014, 4, 14)
}).save();
//console.log(qjx,User.records,User.saveLocal('qjx'),localStorage);
User.saveLocal('qjx');
console.log(localStorage);
User.records = {};
User.loadLocal('qjx');
console.log(User.records);