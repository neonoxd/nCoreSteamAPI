// ==UserScript==
// @name         nCore steamAPI Helper
// @namespace    by dbw
// @version      0.7.6
// @description  nCore x SteamAPI
// @author       neonoxd aka dbw
// @homepageURL      https://github.com/neonoxd/nCoreSteamAPI/
// @updateURL        https://raw.githubusercontent.com/neonoxd/nCoreSteamAPI/master/ncsteamapi.meta.js
// @downloadURL      https://raw.githubusercontent.com/neonoxd/nCoreSteamAPI/master/ncsteamapi.user.js
// @include        https://ncore.cc/*
// @include        https://ncore.nu/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

torrent = function(id) {
		var e = $('#'+id);
		var loading = '<div class="torrent_lenyilo_lehetoseg"><div class="lehetosegek">Lehetőségeid:</div><div class="letoltve"><a href="torrents.php?action=download&id='+id+'&key=be1f25bf429da642453fa65f4aeca3bd"><img src="data:image/gif;base64,R0lGODlhDwAPAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAAPAA8AAAINlI+py+0Po5y02otnAQA7" class="torr_reszletek_btn"></a></div><div class="letoltve_txt"><a href="torrents.php?action=download&id='+id+'&key=be1f25bf429da642453fa65f4aeca3bd">Torrent letöltése</a></div></div><div class="torrent_lenyilo_tartalom"><div style="margin:10px 0;text-align:center"><img src="https://static.ncore.cc/styles/ajax.gif" title="Töltés..."></div></div><div class="torrent_lenyilo_lab"></div>';
        if (!e.html() || e.html()==loading) {
			e.html(loading);
			e.toggle(0);
			$.get('ajax.php?action=torrent_drop&id='+id,function(data) {
				e.html(data);
				BannerEventHandler.init();
				var m = data.match("store\.steampowered\.com\/app\/[0-9]*");
				if (m!=undefined){
					var appid = m[0].split("app/")[1]
					$($(e).find(".torrent_lenyilo_tartalom").find("br")[0]).before("<div class='torrent_steam_tartalom'></div>");
					var steamContentEl = $(e).find(".torrent_steam_tartalom");
					$(steamContentEl).html("&nbsp;");
					$(steamContentEl).addClass("steam_loading");

					$.get('https://cors-anywhere.herokuapp.com/https://store.steampowered.com/api/appdetails/?appids='+appid,function(resp){
					$(steamContentEl).html("");
					$(steamContentEl).removeClass("steam_loading");
                        var steamData = resp[appid].data;
						$(steamContentEl).append("<h2>"+steamData.name+"</h2>");

						var devs ="";
						steamData.developers.forEach(function(dev){ devs+=dev });
						var publishers ="";
						steamData.publishers.forEach(function(pub){ publishers+=pub });
						var genres = "";
						steamData.genres.forEach(function(g){ genres+=g.description+"; "; });
						var categs = "";
						steamData.categories.forEach(function(g){ categs+=g.description+"; "; });


						var descHtml = '<div class="steam_short_desc">'+steamData.short_description+'</div>'

						var cont_support = steamData.controller_support || "N/A";

						var metaHtml=
							'<table class="steam_meta_info">' +
								'<tr><td><strong>Developer: </strong></td><td>' + devs + '</td>'+
								'<tr><td><strong>Publisher: </strong></td><td>' + publishers + '</td>'+
								'<tr><td><strong>Release Date: </strong></td><td>' + steamData.release_date.date + '</td>'+
								'<tr><td><strong>Genre(s): </strong></td><td>' + genres + '</td>'+
								'<tr><td><strong>Categories: </strong></td><td>' + categs + '</td>'+
								'<tr><td><strong>Controller Support: </strong></td><td>' + cont_support + '</td>'+
							'</table>';

						var headerHtml = ""+
									"<table>"+
										"<tr>"+
											"<td><img class='steam_header_img' src='"+steamData.header_image+"'></img></td>"+
											"<td class='steam_header_meta'>"+descHtml+metaHtml+"</td>";
										"</tr>"+
									"</table>"



						$(steamContentEl).append(headerHtml)


						var previews = "";
						var count = 0;
						steamData.screenshots.forEach(function(i){
							var hide = (count>9) ? "hideimg" : "";
							previews+='<td class="kepmeret_ico '+ hide +'"><div class="torrent_kep_ico2"><a class="fancy_groups" rel="g'+id+'" href="'+i.path_full+'"><img class="attached_link" src="'+i.path_thumbnail+'"></a></div></td>'
							count++;
						})

						$(steamContentEl).append(
							'<table class="torrent_kep_ico"><tbody><tr>'+previews+'</tr></tbody></table>'
						)



						$('#'+id+' .fancy_groups').fancybox({'onStart':disableKeys,'onClosed':enableKeys,'type':'image'});
					})

				} else {
					$('#'+id+' .fancy_groups').fancybox({'onStart':disableKeys,'onClosed':enableKeys,'type':'image'});
				}

			});
		} else
			e.toggle(0);
}

var csss = document.createElement('style');
csss.textContent = '.torrent_steam_tartalom { margin:auto; } '+
'.steam_header_img{  } '+
'.steam_short_desc {     border-bottom: 1px solid; padding-bottom: 5px; } '+
'.steam_meta_info {   text-alignt:left !important; margin-top: 5px; } '+
'.steam_header_meta { vertical-align:top;     padding-left: 5px; } '+
'.hideimg {display:none;} '+
'.steam_loading: { background-repeat: no-repeat;background-position: center; background-image: url(https://static.ncore.cc/styles/ajax.gif);}';


document.body.appendChild(csss);

})();
