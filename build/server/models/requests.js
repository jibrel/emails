// Generated by CoffeeScript 1.8.0
var americano, emit;

americano = require('americano');

emit = null;

module.exports = {
  settings: {
    all: americano.defaultRequests.all
  },
  account: {
    all: americano.defaultRequests.all
  },
  contact: {
    all: americano.defaultRequests.all,
    byName: function(doc) {
      var dp, _i, _len, _ref, _results;
      if ((doc.fn != null) && doc.fn.length > 0) {
        emit(doc.fn, doc);
      }
      if (doc.n != null) {
        emit(doc.n.split(';').join(' ').trim(), doc);
      }
      _ref = doc.datapoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dp = _ref[_i];
        if (dp.name === 'email') {
          emit(dp.value, doc);
          _results.push(emit(dp.value.split('@')[1], doc));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    byEmail: function(doc) {
      var dp, _i, _len, _ref, _results;
      _ref = doc.datapoints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dp = _ref[_i];
        if (dp.name === 'email') {
          _results.push(emit(dp.value, doc));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  },
  mailbox: {
    treeMap: function(doc) {
      return emit([doc.accountID].concat(doc.tree), null);
    }
  },
  message: {
    byMailboxRequest: {
      reduce: '_count',
      map: function(doc) {
        var boxid, docDate, uid, xflag, _i, _len, _ref, _ref1;
        _ref = doc.mailboxIDs;
        for (boxid in _ref) {
          uid = _ref[boxid];
          docDate = doc.date || (new Date()).toISOString();
          emit(['uid', boxid, uid], doc.flags);
          emit(['date', boxid, null, docDate], null);
          emit(['subject', boxid, null, doc.normSubject], null);
          _ref1 = ['\\Seen', '\\Flagged', '\\Answered'];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            xflag = _ref1[_i];
            if (-1 === doc.flags.indexOf(xflag)) {
              xflag = '!' + xflag;
            }
            emit(['date', boxid, xflag, docDate], null);
            emit(['subject', boxid, xflag, doc.normSubject], null);
          }
        }
        return void 0;
      }
    },
    dedupRequest: function(doc) {
      if (doc.messageID) {
        emit([doc.accountID, 'mid', doc.messageID], doc.conversationID);
      }
      if (doc.normSubject) {
        return emit([doc.accountID, 'subject', doc.normSubject], doc.conversationID);
      }
    },
    byConversationId: function(doc) {
      if (doc.conversationID) {
        return emit(doc.conversationID);
      }
    }
  }
};
