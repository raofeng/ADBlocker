$(document).ready(function() {
  var Opt = {
    init: function() {
      chrome.storage.sync.get(['raofeng_adb', 'adb_domains', 'adb_paths', 'adb_keywords'], function(item) {
        if (item.raofeng_adb === 'open'){
          $('#adb_act').attr('checked', true);
        } else {
          $('#adb_act').attr('checked', false);
        }
        $('#adb_domains').val(JSON.parse(item.adb_domains).join("\n"));
        $('#adb_paths').val(JSON.parse(item.adb_paths).join("\n"));
        $('#adb_keywords').val(JSON.parse(item.adb_keywords).join("\n"));
      });
    },
    action: function() {
      if ($('#adb_act').is(':checked')) {
        chrome.storage.sync.set({'raofeng_adb': 'open'}, function() {});
        chrome.browserAction.setIcon({
          path : {
            '19': 'images/icon.19.png',
            '38': 'images/icon.38.png'
          }
        });
      } else {
        chrome.storage.sync.remove('raofeng_adb', function() {});
        chrome.browserAction.setIcon({
          path : {
            '19': 'images/icon.19.gray.png',
            '38': 'images/icon.38.gray.png'
          }
        });
      }
      Opt.save_config();
    },
    save_config: function() {
      var adb_domains = JSON.stringify($('#adb_domains').val().split("\n"));
      var adb_paths = JSON.stringify($('#adb_paths').val().split("\n"));
      var adb_keywords = JSON.stringify($('#adb_keywords').val().split("\n"));
      chrome.storage.sync.set({
        'adb_domains': adb_domains,
        'adb_paths': adb_paths,
        'adb_keywords': adb_keywords
      }, function() {
        window.close();
      });
    }
  };

  $('#adb_submit').click(function() {
    Opt.action();
  });

  Opt.init();
});