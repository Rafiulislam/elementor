const originalSwiper = window.Swiper;

export default class Swiper {
	constructor( container, config ) {
		this.config = config;

		if ( this.config.breakpoints ) {
			this.adjustConfig();
		}

		return new originalSwiper( container, this.config );
	}

	// Backwards compatibility for Elementor Pro <2.9.0 (old Swiper version - <5.0.0)
	// In Swiper 5.0.0 and up, breakpoints changed from acting as max-width to acting as min-width
	adjustConfig() {
		const elementorBPs = elementorFrontend.config.breakpoints,
			elementorBPValues = Object.values( elementorBPs );

		Object.keys( this.config.breakpoints ).forEach( ( configBPKey ) => {
			if ( parseInt( configBPKey ) === elementorBPs.md ) {
				// This handles the mobile breakpoint. Elementor's default sm breakpoint is never actually used,
				// so the mobile breakpoint (md) needs to be handled separately and set to the 0 breakpoint (xs)
				this.config.breakpoints[ elementorBPs.xs ] = this.config.breakpoints[ configBPKey ];
			} else {
				// Find the index of the current config breakpoint in the Elementor Breakpoints array
				const currentBPIndexInElementorBPs = elementorBPValues.findIndex( ( elementorBP ) => parseInt( configBPKey ) === elementorBP );

				// For all other Swiper config breakpoints, move them one breakpoint down on the breakpoint list,
				// according to the array of Elementor-defined breakpoints
				this.config.breakpoints[ elementorBPValues[ currentBPIndexInElementorBPs - 1 ] ] = this.config.breakpoints[ configBPKey ];
			}

			// Then reset the settings in the original breakpoint key to the default values
			this.config.breakpoints[ configBPKey ] = {
				slidesPerView: this.config.slidesPerView,
				slidesPerGroup: this.config.slidesPerGroup,
			};
		} );
	}
}

window.Swiper = Swiper;
