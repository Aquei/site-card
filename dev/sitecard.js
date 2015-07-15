(function(){
	"use strict";
	var doc = (document._currentScript || document.currentScript).ownerDocument
		, template = doc.querySelector("template")
		, Proto = Object.create(HTMLElement.prototype)
		, SiteCard;


	Proto.createdCallback = createdCallback;
	//attrName, oldVal, newVal
	Proto.attributeChangedCallback = attributeChangedCallback;
	Proto.update = update;
	Proto.updatePublishDate = updatePublishDate;


	//登録

	try{
		SiteCard = document.registerElement('site-card', {prototype: Proto});
	}catch(e){
		//すでに登録済み
		console.warn("<site-card>は既に登録されています。");
		return;
	}
	

	function createdCallback(){
		var that = this
			, root
			, clone;

		root = this.createShadowRoot();

		clone = document.importNode(template.content, true);

		root.appendChild(clone);

		this.update();
		this.updatePublishDate();

		return this;
	}


	function updatePublishDate(){
		var publishedDate = this.getAttribute("published-date")
			, elem = this.shadowRoot.querySelector(".published-date");

		//update pub date
		if(publishedDate && moment){
			elem.textContent = moment(publishedDate).format("LL");
		}else{
			elem.textContent = "";
		}
	}


	function update(){
		var that = this
			,xhr;


		return req();


		function req(){
			var url = that.getAttribute("url")
				, method = "GET"
				, reqURL
				, async = true;

			if(typeof url === "undefined"){
				return;
			}

			if(xhr && !(xhr.readyState === 0 || xhr.readyState === 4)){
				xhr.abort();
			};

			reqURL = "https://www.srytk.com/a/sitemeta/sitemeta.json";
			reqURL += "?url=" + encodeURIComponent(url);

			xhr = new XMLHttpRequest();
			xhr.open(method
					, reqURL
					, async);

			return new Promise(function(resolve, reject){
				xhr.onload = function(){
					if(xhr.status == 200){
						resolve(xhr.responseText);
					}else{
						reject(xhr.statusText);
					}
				};

				xhr.onerror = function(){
					reject("network error");
				};

				xhr.send();

			}).then(function(res){
				return JSON.parse(res);
			}).then(function(json){
				var meta = json.meta
					,imageUrl
					,url
					,title
					,desc
					,anc = document.createElement("a")
					,cache = {}
					,root = that.shadowRoot;

				if(meta["og:image"]){
					imageUrl = meta["og:image"];
				}else if(meta["twitter:image"]){
					imageUrl = meta["twitter:image"];
				}else{
					imageUrl = "https://pixabay.com/static/uploads/photo/2012/04/10/23/44/question-27106_640.png";
				}

				if(meta["og:title"]){
					title = meta["og:title"];
				}else if(meta["twitter:title"]){
					title = meta["twitter:title"];
				}else if(json.title){
					title = json.title;
				}else{
					title = "NO TITLE";
				}

				if(meta["og:description"]){
					desc = meta["og:description"];
				}else if(meta["twitter:description"]){
					desc = meta["twitter:description"];
				}else if(meta["description"]){
					desc = meta["description"];
				}else{
					desc = "";
				}


				if(meta["og:url"]){
					url = meta["og:url"];
				}else if(meta["twitter:url"]){
					url = meta["twitter:url"];
				}else{
					url = that.getAttribute("url");
				}



				//update image
				cache.img = root.querySelector(".image-container img");
				cache.img.setAttribute("data-src", imageUrl);

				//update title
				cache.title = root.querySelector(".site-title .site-link");
				cache.title.textContent = title;

				//update description
				cache.description = root.querySelector(".description");
				cache.description.textContent = desc;

				//upate link
				cache.links = root.querySelectorAll("a.site-link");
				for(var i=0,c=cache.links.length; i<c; ++i){
					cache.links[i].setAttribute("href", url);
				}


				//update favicon, host
				anc.href = that.getAttribute("url");
				cache.favicon = root.querySelector(".favicon");
				cache.favicon.setAttribute("src", "https://www.google.com/s2/favicons?domain=" + anc.host);

				cache.netLocation = root.querySelector(".net-location");
				cache.netLocation.textContent = '- ' + anc.host;



			}).then(function(data){
				xhr.onload = null;
				xhr.onerror = null;
				
				return data;
			}).catch(function(error){
				console.log("error", error);
				that.setAttribute("hidden", "hidden");
			});
		}


	}

	function attributeChangedCallback(attrName, oldVal, newVal){
		switch(attrName){
			case "published-date":
				this.updatePublishDate();
				break;

			case "url":
				this.update();
				break;
		}
	}


	
})();
