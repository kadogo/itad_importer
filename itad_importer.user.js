// Generated by CoffeeScript 1.7.1

/* IsThereAnyDeal.com Collection Importer

Any patches to this script should be made against the original
CoffeeScript source file available (and documented) at:

  https://github.com/ssokolow/itad_importer

Copyright ©2014 Stephan Sokolow
License: MIT (http://opensource.org/licenses/MIT)

TODO:
- Add support for wishlist importing too
- Add a `@downloadURL` for the script

Note: While we do not use GM_info, we must request it to force the userscript
to be isolated from the page so its jQuery doesn't collide with the site's
jQuery.

// ==UserScript==
// @name IsThereAnyDeal.com Collection Importer
// @version 0.1b1
// @namespace http://isthereanydeal.com/
// @description Adds buttons to various sites to export your game lists to ITAD
// @icon http://s3-eu-west-1.amazonaws.com/itad/images/banners/50x50.gif
// @grant GM_info
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
//
// @match *://www.dotemu.com/*
// @match *://secure.gog.com/account*
// @match *://www.humblebundle.com/home*
// @match *://indiegamestand.com/wallet.php
// @match *://www.shinyloot.com/m/games*
// ==/UserScript==
 */
var BUTTON_LABEL, attr, scrapeGames, scrapers;

BUTTON_LABEL = "Export to ITAD";

attr = function(node, name) {
  return node.getAttribute(name);
};

scrapers = {
  'www.dotemu.com': {
    'https://www\.dotemu\.com/(en|fr|es)/user/?': {
      'source_id': 'dotemu',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        _ref = $('div.field-title a');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            title: attr(x, 'title'),
            url: x.href,
            sources: ['dotemu']
          });
        }
        return _results;
      },
      'insert_button': function() {
        return $('<button></button>').html(BUTTON_LABEL).css({
          float: 'right',
          marginRight: '5px'
        }).appendTo('.my-games h2.pane-title');
      }
    }
  },
  'secure.gog.com': {
    'https://secure\.gog\.com/account(/games(/(shelf|list))?)?/?': {
      'source_id': 'gog',
      'game_list': function() {
        var x, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        if ($('.shelf_container').length > 0) {
          _ref = $('[data-gameindex]');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push({
              id: attr(x, 'data-gameid'),
              url: 'http://www.gog.com/en/game/' + attr(x, 'data-gameindex'),
              sources: ['gog']
            });
          }
          return _results;
        } else if ($('.games_list').length > 0) {
          _ref1 = $('.game-title-link');
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            x = _ref1[_j];
            _results1.push({
              id: $(x).closest('.game-item').attr('id').substring(8),
              title: x.textContent.trim(),
              sources: ['gog']
            });
          }
          return _results1;
        }
      },
      'insert_button': function() {
        if ($('.shelf_container').length > 0) {
          return $("<span class='shelf_btn'></button>").css({
            float: 'right',
            borderRadius: '9px',
            opacity: 0.7,
            marginTop: '15px',
            marginRight: '-32px'
          }).html(BUTTON_LABEL).prependTo($('.shelf_header').filter(':first'));
        } else if ($('.games_list').length > 0) {
          return $("<span class='list_btn'></span>").css({
            float: 'right',
            borderRadius: '9px'
          }).html(BUTTON_LABEL).wrap('<span></span>').appendTo('.list_header');
        }
      }
    }
  },
  'www.humblebundle.com': {
    'https://www\.humblebundle\.com/home/?': {
      'source_id': 'humblestore',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        _ref = $('div.row').has(' .downloads.windows .download, .downloads.linux .download, .downloads.mac .download, .downloads.android .download').find('div.title');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            title: x.textContent.trim(),
            sources: ['humblestore']
          });
        }
        return _results;
      },
      'insert_button': function() {
        var a, label;
        label = $('<span class="label"></span>').html(BUTTON_LABEL);
        a = $('<a class="a" href="#"></span>').html(BUTTON_LABEL).css('padding-left', '9px');
        return $('<div class="flexbtn active noicon"></div>').append('<div class="right"></div>').append(label).append(a).css({
          float: 'right',
          fontSize: '14px',
          fontWeight: 'normal'
        }).prependTo('.base-main-wrapper h1');
      }
    }
  },
  'indiegamestand.com': {
    'https://indiegamestand\.com/wallet\.php': {
      'source_id': 'indiegamestand',
      'game_list': function() {
        var x, _i, _len, _ref, _ref1, _ref2, _ref3, _results;
        _ref = $('#wallet_contents .line-item');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            url: (_ref1 = $('.game-thumb', x)) != null ? (_ref2 = _ref1.closest('a')) != null ? (_ref3 = _ref2[0]) != null ? _ref3.href : void 0 : void 0 : void 0,
            title: $('.game-title', x).text().trim(),
            sources: ['indiegamestand']
          });
        }
        return _results;
      },
      'insert_button': function() {
        return $('<div class="request key"></div>').html(BUTTON_LABEL).wrapInner("<div></div>").css({
          display: 'inline-block',
          marginLeft: '1em',
          verticalAlign: 'middle'
        }).appendTo('#game_wallet h2');
      }
    }
  },
  'www.shinyloot.com': {
    'http://www\.shinyloot\.com/m/games/?': {
      'source_id': 'shinyloot',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        _ref = $('#accordion .ui-widget-content');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            url: $('.right-float a img', x).closest('a')[0].href,
            title: $(x).prev('h3').text().trim(),
            sources: ['shinyloot']
          });
        }
        return _results;
      },
      'insert_button': function() {
        return $('<button></button>').html(BUTTON_LABEL).css({
          background: 'url("/images/filters/sort-background-inactive.png") ' + 'repeat-x scroll 0% 0% transparent',
          border: '1px solid #666',
          borderRadius: '2px',
          boxShadow: '0px 1px 6px #777',
          color: '#222',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: 'Arial,Helvetica,Sans-serif',
          float: 'right',
          padding: '2px 8px',
          marginRight: '-6px',
          verticalAlign: 'middle'
        }).appendTo('#content .header');
      }
    }
  }
};

scrapeGames = function(profile) {
  var form, params;
  params = {
    json: JSON.stringify(profile.game_list()),
    source: profile.source_id
  };
  form = $("<form id='itad_submitter' method='POST' />").attr('action', 'http://isthereanydeal.com/outside/user/collection/3rdparty');
  params['returnTo'] = location.href;
  form.css({
    display: 'none'
  });
  $.each(params, function(key, value) {
    return $("<input type='hidden' />").attr("name", key).attr("value", value).appendTo(form);
  });
  $(document.body).append(form);
  return form.submit();
};

$(function() {
  var profile, regex, _ref, _results;
  _ref = scrapers[location.host];
  _results = [];
  for (regex in _ref) {
    profile = _ref[regex];
    if (location.href.match(regex)) {
      $('#itad_btn, #itad_dlg, .itad_close').remove();
      if (typeof profile.insert_button === "function") {
        profile.insert_button().attr('id', 'itad_btn').click(function() {
          return scrapeGames(profile);
        });
      }
      break;
    } else {
      _results.push(void 0);
    }
  }
  return _results;
});
