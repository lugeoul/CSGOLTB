var csgoltb = document.createElement('script');
csgoltb.type = 'text/javascript';
csgoltb.src = chrome.extension.getURL("csgoltb.js");
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(csgoltb, s);