!function(){"use strict";function t(){var t,e;return t=this.createShadowRoot(),e=document.importNode(c.content,!0),t.appendChild(e),this.update(),this.updatePublishDate(),this}function e(){var t=this.getAttribute("published-date"),e=this.shadowRoot.querySelector(".published-date");e.textContent=t&&moment?moment(t).format("LL"):""}function o(){function t(){var t,r=o.getAttribute("url"),n="GET",i=!0;return console.log("reqest call"),null!==r&&""!==r&&0===r.toString().indexOf("http")?(e&&0!==e.readyState&&4!==e.readyState&&(console.log("既存のリクエストを中止"),e.abort()),t="https://www.srytk.com/a/sitemeta/sitemeta.json",t+="?url="+encodeURIComponent(r),e=new XMLHttpRequest,e.open(n,t,i),console.log("リクエスト準備完了"),new Promise(function(t,o){e.onload=function(){200==e.status?t(e.responseText):o(e.statusText)},e.onerror=function(){o("network error")},console.log("リクエスト開始"),e.send()}).then(function(t){return JSON.parse(t)}).then(function(t){var e,r,n,i,c=t.meta,a=document.createElement("a"),s={},l=o.shadowRoot;e=c["og:image"]?c["og:image"]:c["twitter:image"]?c["twitter:image"]:"http://i.imgur.com/DReqqAW.png",n=c["og:title"]?c["og:title"]:c["twitter:title"]?c["twitter:title"]:t.title?t.title:"NO TITLE",i=c["og:description"]?c["og:description"]:c["twitter:description"]?c["twitter:description"]:c.description?c.description:"",r=c["og:url"]?c["og:url"]:c["twitter:url"]?c["twitter:url"]:o.getAttribute("url"),s.img=l.querySelector(".image-container img"),s.img.setAttribute("data-src",e),s.title=l.querySelector(".site-title .site-link"),s.title.textContent=n,s.description=l.querySelector(".description"),s.description.textContent=i,s.links=l.querySelectorAll("a.site-link");for(var u=0,d=s.links.length;d>u;++u)s.links[u].setAttribute("href",r);r&&0===r.toLowerCase().indexOf("http")&&(a.href=o.getAttribute("url"),s.favicon=l.querySelector(".favicon"),s.favicon.setAttribute("src","https://www.google.com/s2/favicons?domain="+a.host),s.netLocation=l.querySelector(".net-location"),s.netLocation.textContent="- "+a.host)}).then(function(t){return e.onload=null,e.onerror=null,t})["catch"](function(t){console.log("error",t),o.setAttribute("hidden","hidden")})):void 0}var e,o=this;return t()}function r(t,e,o){switch(console.log("attribute changed",t,e,o),t){case"published-date":this.updatePublishDate();break;case"url":this.update()}}var n,i=(document._currentScript||document.currentScript).ownerDocument,c=i.querySelector("template"),a=Object.create(HTMLElement.prototype);a.createdCallback=t,a.attributeChangedCallback=r,a.update=o,a.updatePublishDate=e;try{n=document.registerElement("site-card",{prototype:a})}catch(s){return void console.warn("<site-card>は既に登録されています。")}}();