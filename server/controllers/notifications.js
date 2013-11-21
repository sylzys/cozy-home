// Generated by CoffeeScript 1.6.3
var Notification;

Notification = require('../models/notification');

module.exports = {
  all: function(req, res, next) {
    var _this = this;
    return Notification.all(function(err, notifs) {
      if (err) {
        return next(err);
      } else {
        return res.send(200, notifs);
      }
    });
  },
  deleteAll: function(req, res, next) {
    return Notification.destroyAll(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.send(204, {
          success: true
        });
      }
    });
  },
  show: function(req, res, next) {
    var _this = this;
    return Notification.find(req.params.id, function(err, notif) {
      if (err) {
        return next(err);
      } else if (!notif) {
        return res.send(404, {
          error: 'Notification not found'
        });
      } else {
        return res.send(200, notif);
      }
    });
  },
  "delete": function(req, res, next) {
    var _this = this;
    return Notification.find(req.params.id, function(err, notif) {
      if (err) {
        return next(err);
      } else if (!notif) {
        return res.send(404, {
          error: 'Notification not found'
        });
      } else {
        return notif.destroy(function(err) {
          if (err) {
            return next(err);
          } else {
            return res.send(204, {
              success: true
            });
          }
        });
      }
    });
  },
  create: function(req, res, next) {
    var attributes,
      _this = this;
    attributes = req.body;
    attributes.type = 'temporary';
    if (attributes.resource == null) {
      attributes.resource = {
        app: attributes.app || null,
        url: attributes.url || '/'
      };
    }
    return Notification.create(attributes, function(err, notif) {
      if (err) {
        return next(err);
      } else {
        return res.send(201, {
          success: 'Notification created'
        });
      }
    });
  },
  updateOrCreate: function(req, res, next) {
    var attributes, params,
      _this = this;
    if (!req.params.app || !req.params.ref) {
      return res.send(500, {
        error: 'Wrong usage'
      });
    }
    attributes = req.body;
    attributes.type = 'persistent';
    attributes.ref = req.params.ref;
    attributes.app = req.params.app;
    if (attributes.resource == null) {
      attributes.resource = {
        app: attributes.app,
        url: attributes.url || '/'
      };
    }
    params = {
      key: [req.params.app, req.params.ref]
    };
    return Notification.request('byApps', params, function(err, notifs) {
      if (err) {
        return next(err);
      } else if (!notifs || notifs.length === 0) {
        return Notification.create(attributes, function(err, notif) {
          if (err) {
            return next(err);
          } else {
            return res.send(201, notif);
          }
        });
      } else {
        return notifs[0].updateAttributes(attributes, function(err, notif) {
          if (err) {
            return next(err);
          } else {
            return res.send(200, notif);
          }
        });
      }
    });
  },
  destroy: function(req, res, next) {
    var params,
      _this = this;
    params = {
      key: [req.params.app, req.params.ref]
    };
    return Notification.request('byApps', params, function(err, notifs) {
      if (err) {
        return next(err);
      } else if (!notifs || notifs.length === 0) {
        return res.send(204, {
          success: true
        });
      } else {
        return notifs[0].destroy(function(err) {
          if (err) {
            return next(err);
          } else {
            return res.send(204, {
              success: true
            });
          }
        });
      }
    });
  }
};
