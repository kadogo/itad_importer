// Generated by CoffeeScript 1.7.1

/* IsThereAnyDeal.com Collection Importer

Any patches to this script should be made against the original
CoffeeScript source file available (and documented) at:

  https://github.com/ssokolow/itad_importer

Copyright ©2014 Stephan Sokolow
License: MIT (http://opensource.org/licenses/MIT)

TODO:
- Add a `@downloadURL` for the script

Note: While we do not use GM_info, we must request it to force the userscript
to be isolated from the page so its jQuery doesn't collide with the site's
jQuery.

// ==UserScript==
// @name IsThereAnyDeal.com Collection Importer
// @version 0.1b5
// @namespace http://isthereanydeal.com/
// @description Adds buttons to various sites to export your game lists to ITAD
// @icon http://s3-eu-west-1.amazonaws.com/itad/images/banners/50x50.gif
// @grant GM_info
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
//
// @match *://www.dotemu.com/*
// @match *://fireflowergames.com/my-lists/*
// @match *://secure.gog.com/account*
// @match *://secure.gog.com/checkout*
// @match *://groupees.com/users/*
// @match *://www.humblebundle.com/home*
// @match *://www.humblebundle.com/downloads?key=*
// @match *://www.humblebundle.com/s?key=*
// @match *://indiegamestand.com/wallet.php
// @match *://www.shinyloot.com/m/games*
// @match *://www.shinyloot.com/m/wishlist*
// ==/UserScript==
 */
var BUTTON_LABEL, ITAD_12X12, attr, dotemu_add_button, gog_nonlist_parse, humble_make_button, humble_parse, scrapeGames, scrapers, shinyloot_insert_button;

BUTTON_LABEL = "Export to ITAD";

ITAD_12X12 = "data:image/png;base64,\niVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAZlBMVEUEbrIEbrIJcbQLcrQefboo\ng70rhb4thr8vh78zicA6jcNCksVLl8hWnctZn8xdoc1ipM9ipc9kptB5stZ6staCt9mHutqJu9ud\nxuGozeSrz+W72OrA2+zJ4O7U5vLX6PPn8fj3+vyC0mvkAAAAAXRSTlMAQObYZgAAAFdJREFUCB0F\nwYkCgUAABcA3CpElRyRH6/9/0kwCQALtZSwNglN9Pt5LR+jqGuelEaYbeBXh04P7KMwDeF6E8l1h\nW1vh8PsO/bWeiGPdl/kzdYjdBkACQP5LygQ7CM8T6wAAAABJRU5ErkJggg==";

attr = function(node, name) {
  return node.getAttribute(name);
};

dotemu_add_button = function(parent_selector) {
  return $('<button></button>').html(BUTTON_LABEL).css({
    float: 'right',
    marginRight: '5px'
  }).appendTo(parent_selector);
};

gog_nonlist_parse = function() {
  var x, _i, _len, _ref, _results;
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
};

humble_make_button = function() {
  var a, button, label;
  label = $('<span class="label"></span>').html(BUTTON_LABEL);
  a = $('<a class="a" href="#"></span>').html(BUTTON_LABEL).css('padding-left', '9px');
  return button = $('<div class="flexbtn active noicon"></div>').append('<div class="right"></div>').append(label).append(a);
};

humble_parse = function() {
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
};

shinyloot_insert_button = function() {
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
};

scrapers = {
  'www.dotemu.com': {
    'https://www\\.dotemu\\.com/(en|fr|es)/user/?': [
      {
        'source_id': 'dotemu',
        'game_list': function() {
          var x, _i, _len, _ref, _results;
          _ref = $('div.my-games div.field-title a');
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
          return dotemu_add_button('div.my-games h2.pane-title');
        }
      }, {
        'source_id': 'dotemu',
        'game_list': function() {
          var x, _i, _len, _ref, _results;
          _ref = $('div.user-wishlist .views-field-title-1 a');
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
          return dotemu_add_button('.user-wishlist h2.pane-title');
        },
        'is_wishlist': true
      }
    ]
  },
  'fireflowergames.com': {
    '^http://fireflowergames\\.com/my-lists/(edit-my|view-a)-list/\\?.+': {
      'source_id': 'fireflower',
      'game_list': function() {
        var results, x, _i, _len, _results;
        results = $('table.wl-table tbody td.check-column input:checked').parents('tr').find('td.product-name a');
        if (!results.length) {
          results = $('table.wl-table td.product-name a');
        }
        _results = [];
        for (_i = 0, _len = results.length; _i < _len; _i++) {
          x = results[_i];
          _results.push({
            title: $(x).text().trim(),
            url: x.href,
            sources: ['fireflower']
          });
        }
        return _results;
      },
      'insert_button': function() {
        return $('<a class="button"></a>').html(BUTTON_LABEL).wrap('<td></td>').appendTo($('table.wl-actions-table tbody:first').find('tr:last'));
      },
      'is_wishlist': true
    }
  },
  'secure.gog.com': {
    '^https://secure\\.gog\\.com/checkout/.+': {
      'source_id': 'gog',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        _ref = $('.receipt__content .game-item');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            id: $(x).attr('id').substring(2),
            title: $('.game-title-link', x).text().trim(),
            sources: ['gog']
          });
        }
        return _results;
      },
      'insert_button': function() {
        return $("<span class='social-btn'></span>").html("<img class=\"social-icon\" src=\"" + ITAD_12X12 + "\"\nalt='ITAD' style=\"width: 12px\">Export").css({
          position: 'relative',
          top: -6
        }).prependTo($('.receipt__social').filter(':first'));
      }
    },
    '^https://secure\\.gog\\.com/account(/games(/(shelf|list))?)?/?(\\?|$)': {
      'source_id': 'gog',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        if ($('.shelf_container').length > 0) {
          return gog_nonlist_parse();
        } else if ($('.games_list').length > 0) {
          _ref = $('.game-title-link');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            _results.push({
              id: $(x).closest('.game-item').attr('id').substring(8),
              title: x.textContent.trim(),
              sources: ['gog']
            });
          }
          return _results;
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
    },
    '^https://secure\\.gog\\.com/account/wishlist': {
      'source_id': 'gog',
      'game_list': gog_nonlist_parse,
      'insert_button': function() {
        return $("<span class='list_btn'></span>").css({
          float: 'right',
          borderRadius: '9px'
        }).html(BUTTON_LABEL).wrap('<span></span>').appendTo('.wlist_header');
      },
      'is_wishlist': true
    }
  },
  'groupees.com': {
    'https?://(www\\.)?groupees\\.com/users/\\d+': {
      'source_id': 'other',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        _ref = $('.product .download-dropdown').parents('.details').find('h3');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            title: x.textContent.trim(),
            sources: ['other']
          });
        }
        return _results;
      },
      'insert_button': function() {
        return $("<button></button>").css({
          float: 'right'
        }).addClass('button').html(BUTTON_LABEL + " (Selected Bundle)").insertBefore("input[name='search']");
      }
    }
  },
  'www.humblebundle.com': {
    'https://www\\.humblebundle\\.com/home/?': {
      'source_id': 'humblestore',
      'game_list': humble_parse,
      'insert_button': function() {
        return humble_make_button().css({
          float: 'right',
          fontSize: '14px',
          fontWeight: 'normal'
        }).prependTo('.base-main-wrapper h1');
      }
    },
    'https://www\\.humblebundle\\.com/(download)?s\\?key=.+': {
      'source_id': 'humblestore',
      'game_list': humble_parse,
      'insert_button': function() {
        var parent;
        parent = $('.js-gamelist-holder').parents('.whitebox');
        parent.find('.staple.s4').remove();
        return humble_make_button().css({
          position: 'absolute',
          top: 11,
          right: 17
        }).appendTo(parent);
      }
    }
  },
  'indiegamestand.com': {
    'https://indiegamestand\\.com/wallet\\.php': {
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
    'https?://www\\.shinyloot\\.com/m/games/?': {
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
      'insert_button': shinyloot_insert_button
    },
    'https?://www\\.shinyloot\\.com/m/wishlist/?': {
      'source_id': 'shinyloot',
      'game_list': function() {
        var x, _i, _len, _ref, _results;
        _ref = $('.gameItem');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push({
            url: $('.gameInfo + a', x)[0].href,
            title: $('.gameName', x).text().trim()
          });
        }
        return _results;
      },
      'insert_button': shinyloot_insert_button,
      'is_wishlist': true
    }
  }
};

scrapeGames = function(scraper_obj) {
  var form, params, url;
  params = {
    json: JSON.stringify(scraper_obj.game_list()),
    source: scraper_obj.source_id
  };
  url = scraper_obj.is_wishlist != null ? 'http://isthereanydeal.com/outside/user/wait/3rdparty' : 'http://isthereanydeal.com/outside/user/collection/3rdparty';
  form = $("<form id='itad_submitter' method='POST' />").attr('action', url);
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
  var e, profile, profile_matched, regex, scraper, _fn, _i, _len, _ref, _results;
  console.log("Loading ITAD importer...");
  if (scrapers[location.host]) {
    console.log("Matched domain: " + location.host);
    _ref = scrapers[location.host];
    _results = [];
    for (regex in _ref) {
      profile = _ref[regex];
      try {
        profile_matched = location.href.match(regex);
      } catch (_error) {
        e = _error;
        console.error("Bad regex: " + regex);
      }
      if (profile_matched) {
        console.log("Matched profile: " + regex);
        $('.itad_btn, #itad_dlg, .itad_close').remove();
        if (!Array.isArray(profile)) {
          profile = [profile];
        }
        _fn = function(scraper) {
          return typeof scraper.insert_button === "function" ? scraper.insert_button().addClass('itad_btn').click(function() {
            return scrapeGames(scraper);
          }) : void 0;
        };
        for (_i = 0, _len = profile.length; _i < _len; _i++) {
          scraper = profile[_i];
          _fn(scraper);
        }
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
});
