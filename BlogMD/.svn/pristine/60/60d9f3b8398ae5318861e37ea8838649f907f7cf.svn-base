// ReSharper disable InconsistentNaming
var MaterialSliderEnhance = function MaterialSliderEnhance(element) {
// ReSharper restore InconsistentNaming
    this.element_ = element;
    // Browser feature detection.
    this.isIE_ = window.navigator.msPointerEnabled;
    // Initialize instance.
    this.init();
};
window['MaterialSliderEnhance'] = MaterialSliderEnhance;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
MaterialSliderEnhance.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
MaterialSliderEnhance.prototype.CssClasses_ = {
    IE_CONTAINER: 'mdl-slider__ie-container',
    SLIDER_CONTAINER: 'mdl-slider__container',
    BACKGROUND_FLEX: 'mdl-slider__background-flex',
    BACKGROUND_LOWER: 'mdl-slider__background-lower',
    BACKGROUND_UPPER: 'mdl-slider__background-upper',
    BACKGROUND_MIDDLE: 'mdl-slider__background-middle',
    IS_LOWEST_VALUE: 'is-lowest-value',
    IS_UPGRADED: 'is-upgraded'
};
/**
   * Handle input on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSliderEnhance.prototype.onInput_ = function (event) {
    this.updateValueStylesEnhanced_();
};
/**
   * Handle change on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSliderEnhance.prototype.onChange_ = function (event) {
    this.updateValueStylesEnhanced_();
};
/**
   * Handle mouseup on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSliderEnhance.prototype.onMouseUp_ = function (event) {
    event.target.blur();
};
/**
   * Handle mousedown on container element.
   * This handler is purpose is to not require the use to click
   * exactly on the 2px slider element, as FireFox seems to be very
   * strict about this.
   *
   * @param {Event} event The event that fired.
   * @private
   * @suppress {missingProperties}
   */
MaterialSliderEnhance.prototype.onContainerMouseDown_ = function (event) {
    // If this click is not on the parent element (but rather some child)
    // ignore. It may still bubble up.
    if (event.target !== this.element_.parentElement) {
        return;
    }
    // Discard the original event and create a new event that
    // is on the slider element.
    event.preventDefault();
    var newEvent = new MouseEvent('mousedown', {
        target: event.target,
        buttons: event.buttons,
        clientX: event.clientX,
        clientY: this.element_.getBoundingClientRect().y
    });
    this.element_.dispatchEvent(newEvent);
};
/**
   * Handle updating of values.
   *
   * @private
   */
MaterialSliderEnhance.prototype.updateValueStylesEnhanced_ = function () {
    // Calculate and apply percentages to div structure behind slider.
    var fractionPlayed = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min); 
    var fractionBuffered;
    if (this.element_.buffered != null && this.element_.buffered > this.element_.value)
        fractionBuffered = ( this.element_.buffered - this.element_.value) / (this.element_.max - this.element_.min);
    else
        fractionBuffered = 0;
    if (fractionPlayed === 0) {
        this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
    }
    if (!this.isIE_) {
        this.backgroundLower_.style.flex = fractionPlayed;
        this.backgroundLower_.style.webkitFlex = fractionPlayed;
        this.backgroundMiddle_.style.flex = fractionBuffered;
        this.backgroundMiddle_.style.webkitFlex = fractionBuffered;
        this.backgroundUpper_.style.flex = 1 - fractionPlayed - fractionBuffered;
        this.backgroundUpper_.style.webkitFlex = 1 - fractionPlayed - fractionBuffered;
    }
};
// Public methods.
/**
   * Disable slider.
   *
   * @public
   */
MaterialSliderEnhance.prototype.disable = function () {
    this.element_.disabled = true;
};
MaterialSliderEnhance.prototype['disable'] = MaterialSliderEnhance.prototype.disable;
/**
   * Enable slider.
   *
   * @public
   */
MaterialSliderEnhance.prototype.enable = function () {
    this.element_.disabled = false;
};
MaterialSliderEnhance.prototype['enable'] = MaterialSliderEnhance.prototype.enable;
/**
   * Update slider value.
   *
   * @param {number} value The value to which to set the control (optional).
   * @public
   */
MaterialSliderEnhance.prototype.change = function (value,buffered) {
    if (typeof value !== 'undefined') {
        this.element_.value = value;
    }
    if (typeof buffered !== 'undefined') {
        this.element_.buffered=buffered;
    }
    this.updateValueStylesEnhanced_();
};
MaterialSliderEnhance.prototype['change'] = MaterialSliderEnhance.prototype.change;
/**
   * Initialize element.
   */
MaterialSliderEnhance.prototype.init = function () {
    if (this.element_) {
        if (this.isIE_) {
            // Since we need to specify a very large height in IE due to
            // implementation limitations, we add a parent here that trims it down to
            // a reasonable size.
            var containerIE = document.createElement('div');
            containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
            this.element_.parentElement.insertBefore(containerIE, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            containerIE.appendChild(this.element_);
        } else {
            // For non-IE browsers, we need a div structure that sits behind the
            // slider and allows us to style the left and right sides of it with
            // different colors.
            var container = document.createElement('div');
            container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
            this.element_.parentElement.insertBefore(container, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            container.appendChild(this.element_);
            var backgroundFlex = document.createElement('div');
            backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
            container.appendChild(backgroundFlex);
            this.backgroundLower_ = document.createElement('div');
            this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
            backgroundFlex.appendChild(this.backgroundLower_);
            this.backgroundMiddle_ = document.createElement('div');
            this.backgroundMiddle_.classList.add(this.CssClasses_.BACKGROUND_MIDDLE);
            backgroundFlex.appendChild(this.backgroundMiddle_);
            this.backgroundUpper_ = document.createElement('div');
            this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
            backgroundFlex.appendChild(this.backgroundUpper_);
        }
        this.boundInputHandler = this.onInput_.bind(this);
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
        this.element_.addEventListener('input', this.boundInputHandler);
        this.element_.addEventListener('change', this.boundChangeHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);
        this.updateValueStylesEnhanced_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSliderEnhance,
    classAsString: 'MaterialSliderEnhance',
    cssClass: 'mdl-js-sliderEnhance',
    widget: true
});