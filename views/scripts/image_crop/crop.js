/**
 *
 *  jQuery Image Cropper
 *  http://danielhellier.com/imagecrop/
 *
 */

var CROP = (function () {

	return function () {

		// Code Dependant Variables
		this.eles = {
			ele: undefined,
			container: undefined,
			img: undefined,
			overlay: undefined
		};

		this.img = undefined;
		this.imgInfo = {
			aw: 0,
			ah: 0,
			w: 0,
			h: 0,
			at: 0,
			al: 0,
			t: 0,
			l: 0,
			s: 1 // scale
		};

		this.init = function (ele) {

			// link slider
			this.settings = {
				slider: ele + ' .cropSlider'
			};

			/*
				Elements
			*/
			var ele = $(ele + ' .cropMain')
				, img
				, container
				, overlay
				, that = this;

			/*
				Container
			*/
			container = $('<div />')
				.attr({
					class: 'crop-container'
				})
				.css({
					width: ele.width(),
					height: ele.height()
				});

			/*
				Image
			*/
			img = $('<img />')
				.attr({
					class: 'crop-img'
				})
				.css({
					zIndex: 5999,
					top: 0,
					left: 0
				});

			/*
				Crop Overlay
			*/
			overlay = $('<div />')
				.attr({
					class: 'crop-overlay'
				})
				.css({
					zIndex: 6000
				});


			// Add Elements
			container.append(overlay);
			container.append(img);
			ele.append(container);

			this.eles.ele = ele;
			this.eles.container = container;
			this.eles.img = img;
			this.eles.overlay = overlay;


			/*
				Bind Events
			*/
			container.resize(function () {
				that.imgSize();
			});


			/*
				Overlay Movement
			*/
			overlay.bind(((document.ontouchstart !== null) ? 'mousedown':'touchstart'), function (e) {

				var o = $(this),
					mousedown = {
						x: (e.pageX || e.originalEvent.pageX),
						y: (e.pageY || e.originalEvent.pageY),
					},
					elepos = {
						x: o.parent().offset().left,
						y: o.parent().offset().top
					};

				e.preventDefault();

				$(document).bind(((document.ontouchmove !== null) ? 'mousemove':'touchmove'), function (e) {

					if (e.pageX || typeof e.originalEvent.changedTouches[0] !== undefined) {

						var mousepos = {
							x: (e.pageX || e.originalEvent.changedTouches[0].pageX),
							y: (e.pageY || e.originalEvent.changedTouches[0].pageY)
						};

						if (parseInt(o.css('top')) == 0) {
							o.css({
								top: that.eles.ele.offset().top,
								left: that.eles.ele.offset().left
							});
						}

						// Move Image
						that.imgMove({
							t: parseInt(o.css('top')) - (elepos.y - (mousedown.y - mousepos.y)),
							l: parseInt(o.css('left')) - (elepos.x - (mousedown.x - mousepos.x))
						});

						// Reposition Overlay
						o.css({
							left: elepos.x - (mousedown.x - mousepos.x),
							top: elepos.y - (mousedown.y - mousepos.y)
						});
					}
				});

				return false;
			});

			$(document).bind(((document.ontouchend !== null) ? 'mouseup':'touchend'), function (e) {

				$(document).unbind(((document.ontouchmove !== null) ? 'mousemove':'touchmove'));
				overlay.css({
					top: 0,
					left: 0
				});
			});

			/*
				Configure Slider
			*/
			this.slider();

		};

		this.loadImg = function (url) {
			var that = this;

			this.eles.img
				.attr('src', url)
				.load(function () {
					that.imgSize();
				});
		};

		this.imgSize = function () {
			var img = this.eles.img
				, imgSize = {
					w: img.css('width', '').width(),
					h: img.css('height', '').height()
				}
				, c = this.eles.container;

			var holderRatio = {
				wh: this.eles.container.width()/this.eles.container.height(),
				hw:this.eles.container.height()/this.eles.container.width()
			};

			this.imgInfo.aw = imgSize.w;
			this.imgInfo.ah = imgSize.h;

			if (imgSize.w * holderRatio.hw < imgSize.h * holderRatio.wh) {

				this.imgInfo.w = c.width() - (40*2);
				this.imgInfo.h = this.imgInfo.w * (imgSize.h / imgSize.w);
				this.imgInfo.al = 40;

			} else {

				this.imgInfo.h = c.height() - (40*2);
				this.imgInfo.w = this.imgInfo.h * (imgSize.w / imgSize.h);
				this.imgInfo.at = 40;
			}

			this.imgResize();
		};


		this.imgResize = function (scale) {

			var img = this.eles.img,
				imgInfo = this.imgInfo,
				oldScale = imgInfo.s;

			imgInfo.s = scale || imgInfo.s;

			img.css({
				width: imgInfo.w * imgInfo.s,
				height: imgInfo.h * imgInfo.s
			});

			// Move Image Based on Size Changes
			this.imgMove({
				t: -((imgInfo.h * oldScale) - (imgInfo.h * imgInfo.s))/2,
				l: -((imgInfo.w * oldScale) - (imgInfo.w * imgInfo.s))/2
			});
		};

		this.imgMove = function (move) {

			var img = this.eles.img,
				imgInfo = this.imgInfo,
				c = this.eles.container;

			imgInfo.t += move.t;
			imgInfo.l += move.l;

			var t = imgInfo.at - imgInfo.t,
				l = imgInfo.al - imgInfo.l;

			if (t > 40) {
				t = 40;
				imgInfo.t = (imgInfo.at == 40) ? 0 : -40;
			} else if (t < -((imgInfo.h * imgInfo.s) - (c.height() - 40))) {
				t = -((imgInfo.h * imgInfo.s) - (c.height() - 40));
				imgInfo.t = ((imgInfo.at == 40) ? (imgInfo.h * imgInfo.s) - (c.height() - 80) : (imgInfo.h * imgInfo.s) - (c.height() - 40));
			}

			if (l > 40) {
				l = 40;
				imgInfo.l = (imgInfo.al == 40) ? 0 : -40;
			} else if (l < -((imgInfo.w * imgInfo.s) - (c.width() - 40))) {
				l = -((imgInfo.w * imgInfo.s) - (c.width() - 40));
				imgInfo.l = ((imgInfo.al == 40) ? (imgInfo.w * imgInfo.s) - (c.width() - 80) : (imgInfo.w * imgInfo.s) - (c.width() - 40));
			}

			// Set Position
			img.css({
				top: t,
				left: l
			});

		};

		/*
			Slider
		*/
		this.slider = function () {

			var that = this;
			$(this.settings.slider).noUiSlider({
			     range: [1, 4]
			   , start: 1
			   , step: 0.002
			   , handles: 1
			   , slide: function(){
			      var val = $(this).val();

			      that.imgResize(val);
			   }
			});
		};

		// get cropped coordinates
		coordinates = function coordinates(self) {

			var imgInfo = self.imgInfo,
				c = self.eles.container,
				img = self.eles.img,
				imgsrc = img.attr('src'),

				coordinates = {
					x: -(parseInt(img.css('left')) - 40) * (imgInfo.aw / (imgInfo.w * imgInfo.s)),
					y: -(parseInt(img.css('top')) - 40) * (imgInfo.ah / (imgInfo.h * imgInfo.s)),
					w: (c.width() - (40*2)) * (imgInfo.aw / (imgInfo.w * imgInfo.s)),
					h: (c.height() - (40*2)) * (imgInfo.ah / (imgInfo.h * imgInfo.s)),
					image: imgsrc,
				};;

			// return coodinates
			return coordinates;
		}

	};

}());

// nouislider.min.js - http://refreshless.com/nouislider/
(function(f){f.fn.noUiSlider=function(n,r){function s(a,e,c){var g=e.data("setup"),l=g.handles;e=g.settings;g=g.pos;a=0>a?0:100<a?100:a;2==e.handles&&(c.is(":first-child")?(c=parseFloat(l[1][0].style[g])-e.margin,a=a>c?c:a):(c=parseFloat(l[0][0].style[g])+e.margin,a=a<c?c:a));e.step&&(c=m.from(e.range,e.step),a=Math.round(a/c)*c);return a}function t(a){try{return[a.clientX||a.originalEvent.clientX||a.originalEvent.touches[0].clientX,a.clientY||a.originalEvent.clientY||a.originalEvent.touches[0].clientY]}catch(e){return["x","y"]}}var j=window.navigator.msPointerEnabled?2:"ontouchend"in document?3:1;window.debug&&console&&console.log(j);var m={to:function(a,e){e=0>a[0]?e+Math.abs(a[0]):e-a[0];return 100*e/this._length(a)},from:function(a,e){return 100*e/this._length(a)},is:function(a,e){return e*this._length(a)/100+a[0]},_length:function(a){return a[0]>a[1]?a[0]-a[1]:a[1]-a[0]}},w={handles:2,serialization:{to:["",""],resolution:0.01}};methods={create:function(){return this.each(function(){var a=f.extend(w,n),e=f(this).data("_isnS_",!0),c=[],g,l,b="",h=function(a){return!isNaN(parseFloat(a))&&isFinite(a)},k=(a.serialization.resolution=a.serialization.resolution||0.01).toString().split("."),q=1==k[0]?0:k[1].length;a.start=h(a.start)?[a.start,0]:a.start;f.each(a,function(b,d){h(d)?a[b]=parseFloat(d):"object"==typeof d&&h(d[0])&&(d[0]=parseFloat(d[0]),h(d[1])&&(d[1]=parseFloat(d[1])));var c=!1;d="undefined"==typeof d?"x":d;switch(b){case "range":case "start":c=2!=d.length||!h(d[0])||!h(d[1]);break;case "handles":c=1>d||2<d||!h(d);break;case "connect":c="lower"!=d&&"upper"!=d&&"boolean"!=typeof d;break;case "orientation":c="vertical"!=d&&"horizontal"!=d;break;case "margin":case "step":c="undefined"!=typeof d&&!h(d);break;case "serialization":c="object"!=typeof d||!h(d.resolution)||"object"==typeof d.to&&d.to.length<a.handles;break;case "slide":c="function"!=typeof d}c&&console&&console.error("Bad input for "+b+" on slider:",e)});a.margin=a.margin?m.from(a.range,a.margin):0;if(a.serialization.to instanceof jQuery||"string"==typeof a.serialization.to||!1===a.serialization.to)a.serialization.to=[a.serialization.to];"vertical"==a.orientation?(b+="vertical",g="top",l=1):(b+="horizontal",g="left",l=0);b+=a.connect?"lower"==a.connect?" connect lower":" connect":"";e.addClass(b);for(b=0;b<a.handles;b++){c[b]=e.append("<a><div></div></a>").children(":last");k=m.to(a.range,a.start[b]);c[b].css(g,k+"%");100==k&&c[b].is(":first-child")&&c[b].css("z-index",2);var k=(1===j?"mousedown":2===j?"MSPointerDown":"touchstart")+".noUiSliderX",r=(1===j?"mousemove":2===j?"MSPointerMove":"touchmove")+".noUiSlider",v=(1===j?"mouseup":2===j?"MSPointerUp":"touchend")+".noUiSlider";c[b].find("div").on(k,function(b){f("body").bind("selectstart.noUiSlider",function(){return!1});if(!e.hasClass("disabled")){f("body").addClass("TOUCH");var d=f(this).addClass("active").parent(),h=d.add(f(document)).add("body"),k=parseFloat(d[0].style[g]),j=t(b),u=j,n=!1;f(document).on(r,function(b){b.preventDefault();b=t(b);if("x"!=b[0]){b[0]-=j[0];b[1]-=j[1];var p=[u[0]!=b[0],u[1]!=b[1]],f=k+100*b[l]/(l?e.height():e.width()),f=s(f,e,d);if(p[l]&&f!=n){d.css(g,f+"%").data("input").val(m.is(a.range,f).toFixed(q));var p=a.slide,h=e.data("_n",!0);"function"===typeof p&&p.call(h,void 0);n=f;d.css("z-index",2==c.length&&100==f&&d.is(":first-child")?2:1)}u=b}}).on(v,function(){h.off(".noUiSlider");f("body").removeClass("TOUCH");e.find(".active").removeClass("active").end().data("_n")&&e.data("_n",!1).change()})}}).on("click",function(a){a.stopPropagation()})}if(1==j)e.on("click",function(b){if(!e.hasClass("disabled")){var d=t(b);b=100*(d[l]-e.offset()[g])/(l?e.height():e.width());d=1<c.length?d[l]<(c[0].offset()[g]+c[1].offset()[g])/2?c[0]:c[1]:c[0];b=s(b,e,d);d.css(g,b+"%").data("input").val(m.is(a.range,b).toFixed(q));b=a.slide;"function"===typeof b&&b.call(e,void 0);e.change()}});for(b=0;b<c.length;b++)k=m.is(a.range,parseFloat(c[b][0].style[g])).toFixed(q),"string"==typeof a.serialization.to[b]?c[b].data("input",e.append('<input type="hidden" name="'+a.serialization.to[b]+'">').find("input:last").val(k).change(function(a){a.stopPropagation()})):!1==a.serialization.to[b]?c[b].data("input",{val:function(a){if("undefined"!=typeof a)this.handle.data("noUiVal",a);else return this.handle.data("noUiVal")},handle:c[b]}):c[b].data("input",a.serialization.to[b].data("handleNR",b).val(k).change(function(){var a=[null,null];a[f(this).data("handleNR")]=f(this).val();e.val(a)}));f(this).data("setup",{settings:a,handles:c,pos:g,res:q})})},val:function(a){if("undefined"!==typeof a){var e="number"==typeof a?[a]:a;return this.each(function(){for(var a=f(this).data("setup"),b=0;b<a.handles.length;b++)if(null!=e[b]){var c=s(m.to(a.settings.range,e[b]),f(this),a.handles[b]);a.handles[b].css(a.pos,c+"%").data("input").val(m.is(a.settings.range,c).toFixed(a.res))}})}a=f(this).data("setup").handles;for(var c=[],g=0;g<a.length;g++)c.push(parseFloat(a[g].data("input").val()));return 1==c.length?c[0]:c},disabled:function(){return r?f(this).addClass("disabled"):f(this).removeClass("disabled")}};var v=jQuery.fn.val;jQuery.fn.val=function(){return this.data("_isnS_")?methods.val.apply(this,arguments):v.apply(this,arguments)};return"disabled"==n?methods.disabled.apply(this):methods.create.apply(this)}})(jQuery);