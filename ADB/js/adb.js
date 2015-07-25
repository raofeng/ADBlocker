function in_array(needle, haystack, argStrict) {
  var key = '',
    strict = !!argStrict;
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
}

function extractDomain(url) {
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  return domain;
}

var urls = [
    'su.bdimg.com',
    'cpro.baidustatic.com',
    'pagead2.googlesyndication.com',
    'atanx.alicdn.com'
  ];
var paths = ['2tu/ads'];
var keywords = ['p.tanx.com'];
var keys = ['raofeng_adb', 'adb_domains', 'adb_paths', 'adb_keywords'];

var doFilter = function(node) {
  if (node.src) {
    if (in_array(extractDomain(node.src), urls)) {
      node.parentNode.removeChild(node);
    } else {
      for (var i = 0; i < paths.length; i++) {
        if (node.src.indexOf(paths[i]) > -1)
          node.parentNode.removeChild(node);
      }
    }
  } else {
    for (var i = 0; i < keywords.length; i++) {
      if (node.innerHTML.indexOf(keywords[i]) > -1)
        node.parentNode.removeChild(node);
    }
  }
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var node = mutation.addedNodes[i];
        if (node.nodeName.toLowerCase() === 'script') {
          doFilter(node);
        }
      }
    }
  });
});

chrome.storage.sync.get(keys, function(item) {
  if (item.raofeng_adb === 'open') {
    urls = JSON.parse(item.adb_domains);
    paths = JSON.parse(item.adb_paths);
    keywords = JSON.parse(item.adb_keywords);
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    if (in_array(key, keys)) {
      window.location.reload();
      break;
    }
  }
});