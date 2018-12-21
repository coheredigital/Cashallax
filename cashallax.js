// instersection observer class controlls
$.fn.cashallax = function(passedOptions) {
    var $elements = $(this);

    // track page scrolling
    var initOptions = $.extend(
        {
            // defaults
            anchor: "middle",
            scale: 1.4,
            speed: 1.4
        },
        passedOptions
    );

    var bounding = {
        top: null,
        bottom: null,
        middle: null,
        height: $(window).innerHeight(),
        changed: true
    };

    $.fn.updateElement = function() {
        // clone init options so each element can be handled differently
        var $this = $(this);
        var options = $this.data("options");

        var anchorPosition = bounding.bottom - options.anchorPoint;
        var anchorCompensation = 0;

        // adjust offset for anchor on page
        if (options.anchor == "middle") {
            var anchorCompensation = 50;
        } else if (options.anchor == "top") {
            var anchorCompensation = 100;
        }

        var anchorOffset =
            ((anchorPosition / bounding.height) * 100 - anchorCompensation) * 2;

        // shift = fraction of height difference relative to center offset with half scale compensation
        var shift =
            (options.movement * (anchorOffset / 100)) /
            (options.scale - (options.scale - 1) / 2);

        // apply before repaint
        window.requestAnimationFrame(function() {
            $this.css(
                "transform",
                "translate3D(0," +
                    shift +
                    "px, 0) " +
                    "scale(" +
                    options.scale +
                    ")"
            );
        });
    };

    $.fn.updateScrollState = function() {
        var previous = bounding.top;

		bounding.changed = false;
		
        if (window.pageYOffset !== undefined) {
            bounding.top = window.pageYOffset;
        } else {
            bounding.top = (
                document.documentElement ||
                document.body.parentNode ||
                document.body
            ).scrollTop;
        }

        // canclet further processing when bounding has not moved
        if (previous == bounding.top) {
            return;
        }
        bounding.changed = true;
        bounding.bottom = bounding.top + bounding.height;
        bounding.middle = bounding.top + bounding.height / 2;
    };

    $(window).updateScrollState();

    // init setup
    this.each(function() {
        var $this = $(this);
        var options = $.extend({}, initOptions);
        var offset = $this.offset();

        if ($this.data("parallax-anchor")) {
            options.anchor = $this.data("parallax-anchor");
        }

        offset.height = $this.innerHeight();
        offset.bottom = offset.top + offset.height;
        offset.middle = offset.top + offset.height / 2;
        options.offset = offset;

        // get the offest point
        if ($this.data("parallax-anchor")) {
            options.anchor = $this.data("parallax-anchor");
        }
        if ($this.data("parallax-scale")) {
            options.scale = $this.data("parallax-scale");
        }
        if ($this.data("parallax-speed")) {
            options.speed = $this.data("parallax-speed");
        }

        switch (options.anchor) {
            case "top":
                options.anchorPoint = offset.top;
                break;
            case "middle":
                options.anchorPoint = offset.middle;
                break;
            case "bottom":
                options.anchorPoint = offset.bottom;
                break;
        }

        options.height = offset.height;
        options.movement = offset.height * options.speed - offset.height;

        // store ooptions to be used in loop
        $this.data("options", options);

        // initial position
        $this.updateElement();
    });



    function updateItems() {
        var $this = $(window);
        $this.updateScrollState();

        // only run when scrolling
        if (!bounding.changed) {
            return;
        }

        $elements.each(function() {
            var $this = $(this);
            var options = $this.data("options");

            // prevent running on elements not in view
            if (
                bounding.top > options.offset.bottom ||
                bounding.bottom < options.offset.top
            ) {
                return;
            }

            $this.updateElement();
        });
    }

    $(window).on('scroll', function(){
    	updateItems();
    });

};
