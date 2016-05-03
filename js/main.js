function rand(min, max){ return max ? Math.floor(Math.random() * (max - min + 1)) + min : Math.floor(Math.random() * (min + 1)); }

var app = app || {};

app.initBuyMap = (function () {
  var
    markerPic = 'images/map-marker.png',
    map,
    currentMarker;

  function initialize(lat, lng) {
    var mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(lat, lng)
    };

    map = new google.maps.Map(document.getElementById('buy-map'),
      mapOptions);

    var myLatLng = new google.maps.LatLng(lat, lng);
    currentMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: markerPic
    });
  }

  return function (places) {
    if (!$.isArray(places)) {
      console.warn('Places must be Array');
      return false;
    }

    var
      current;

    for (var i = 0; i < places.length; i++) {
      (function (i) {
        var
          $toggle = $('#map-toggle-' + places[i].toggle);

        if (places[i].current && !current) {
          google.maps.event.addDomListener(window, 'load', function () {
            initialize(places[i].lat, places[i].lng);
            $toggle.setMod('state', 'active');
          });
        }

        google.maps.event.addDomListener(window, 'load', function () {
          $toggle.on('click', function () {
            var
              $el = $(this),
              newLatLng = new google.maps.LatLng(places[i].lat, places[i].lng);

            currentMarker.setMap(null);
            currentMarker = new google.maps.Marker({
              position: newLatLng,
              map: map,
              icon: markerPic
            });

            map.panTo(newLatLng);
            $el.setMod('state', 'active').siblings().delMod('state');
          });
        });
      })(i);
    }
  };
})();

app.popup = (function () {
  var keys = {37: 1, 38: 1, 39: 1, 40: 1};

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  return {
    open: function (selector) {
      $(selector).arcticmodal({
        overlay: {
          css: {
            backgroundColor: '#000000',
            opacity: .2
          }
        },

        beofreOpen: function (obj, node) {
          $('.scroller', node).data('baron').update();
        },

        afterOpen: function (obj, node) {
          $('.scroller', node).data('baron').update();

          var top = $(window).scrollTop();
          $(window).on('scroll.popup', function () {
            $('html, body').scrollTop(top);
          });
        },
        afterClose: function () {
          $(window).off('scroll.popup');
        }
      });
    }
  }
})();

app.openFdd =function (selector) {
  var
    $el = $(selector);

  $el.slideDown(function () {
    $('.f-dd__close', $el).one('click', function () {
      $el.slideUp();
    });
  });

  $('html, body').animate({'scrollTop': $el.offset().top});
};

$(function () {
  var
    $htmlbody = $('html, body'),
    $body = $('body');

  //slider
  $('.slider__list').bxSlider({
    prevText: '',
    nextText: '',
    prevSelector: '.slider__control_dir_prev',
    nextSelector: '.slider__control_dir_next',
    pager: false,
    auto: true,
    pause: 7000
  });

  //navigation
  $('.nav__item a').on('click', function (e) {
    e.preventDefault();

    var idBlock = $(this).attr('href');
    $htmlbody.animate({'scrollTop': $(idBlock).offset().top});
    location.href = idBlock;
  });

  //init custom scrollbars
  $('.scroller').each(function () {
    var $el = $(this);
    $el.data('baron', baron({
      scroller: $el,
      root: $el.children('.scroller__content'),
      bar: $el.children('.scroller__bar').children(),
      barOnCls: 'baron'
    }));
  });

  //gremlin animate
  (function () {
    var
      $w = $(window),
      $gremlin = $('.gremlin'),
      $gremlins = $('.gremlin-finish'),
      gremlinsPosY = [],
      gremlinsPosX = [],
      gremlinHeight = [],
      beforeScrollTop = $w.scrollTop(),
      moveSpeed = 1000,
      heightSpeed = 300,
      curentGremlinIndex = -1,
      lock = false;

    $gremlins.each(function () {
      gremlinsPosY.push($(this).offset().top);
      gremlinsPosX.push($(this).data('position'));
      gremlinHeight.push($(this).data('height'));
    });

    $w.on('scroll', function (e) {
      if (lock) {
        return false;
      }

      if ($w.scrollTop() + $w.height() < gremlinsPosY[0]) {
        curentGremlinIndex = -1;
        $gremlin.css({top: 0, left: 0});
      }

      for (var i = 0; i < $gremlins.length; i++) {
        if (gremlinsPosY[i] >= $w.scrollTop() && gremlinsPosY[i] < $w.scrollTop() + $w.height()) {
          (function (i) {
            if (curentGremlinIndex == i) {
              return false;
            }

            curentGremlinIndex = i;
            lock = true;

            $gremlin.animate({
              'top' : gremlinsPosY[i] + $gremlin.height(),
              'left': (gremlinsPosX[i] == 'right' ? '100%' : $gremlin.width())
            }, {
              duration: moveSpeed,
              complete: function () {
                $gremlin.animate({top: gremlinsPosY[i] + $gremlin.height() - gremlinHeight[i]}, {
                  duration: heightSpeed,
                  complete: function () {
                    lock = false;
                  }
                });
              }
            });
          })(i);
        }
      }
    })
  })();

  //loop instructions
  (function () {
    var
      popupIds = ['#popup-1', '#popup-2'],
      popupIndex = 0;

    function showPopup (index) {
      if (typeof popupIds[index] === 'undefined') {
        popupIndex = 0;
        showPopup(popupIndex);
      } else {
        app.popup.open(popupIds[index]);
        popupIndex++;
      }
    }

    $('.js-datils-popup-loop').on('click', function () { showPopup(popupIndex); });
  })();
});