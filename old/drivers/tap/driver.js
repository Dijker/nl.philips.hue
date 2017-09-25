'use strict';

const Driver	= require('../../lib/Driver.js');

const buttonEventMap		= {
	'34': 'button1',
	'16': 'button2',
	'17': 'button3',
	'18': 'button4'
}

class DriverTap extends Driver {

	constructor() {
		super();

		this._deviceType = 'sensor';

		Homey
			.manager('flow')
			.on('trigger.tap_button_pressed', this._onFlowTriggerTapButtonPressed.bind(this));

	}

	_syncDevice( device_data ) {
		this.debug('_syncDevice', device_data.id);

		let deviceInstance = this.getDeviceInstance( device_data );
		if( deviceInstance instanceof Error )
			return module.exports.setUnavailable( device_data, __('unreachable') );

		module.exports.setAvailable( device_data );

		// if button changed, but not first time
		if( typeof this._devices[ device_data.id ].buttonEvent === 'undefined' ) {
			this._devices[ device_data.id ].buttonEvent = deviceInstance.state.buttonEvent;
			this._devices[ device_data.id ].lastUpdated = deviceInstance.state.lastUpdated;
		} else {

			// if last press changed and button is the same
			if( deviceInstance.state.lastUpdated !== this._devices[ device_data.id ].lastUpdated
			 && deviceInstance.state.buttonEvent === this._devices[ device_data.id ].buttonEvent ) {
				this._devices[ device_data.id ].lastUpdated = deviceInstance.state.lastUpdated;

				Homey.manager('flow').triggerDevice('tap_button_pressed', null, {
					button: buttonEventMap[ deviceInstance.state.buttonEvent ]
				}, device_data);

			}

			// else if the button has changed
			else if( this._devices[ device_data.id ].buttonEvent !== deviceInstance.state.buttonEvent ) {
				this._devices[ device_data.id ].buttonEvent = deviceInstance.state.buttonEvent;
				this._devices[ device_data.id ].lastUpdated = deviceInstance.state.lastUpdated;

				Homey.manager('flow').triggerDevice('tap_button_pressed', null, {
					button: buttonEventMap[ deviceInstance.state.buttonEvent ]
				}, device_data);

			}
		}

	}

	_onExportsPairListDevices( state, data, callback ) {

		if( !state.bridge )
			return callback( 'invalid_bridge' );

		if( state.bridge instanceof Error )
			return callback( state.bridge );

		let result = [];

		for( let sensor of state.bridge.getSensors() ) {

			if( sensor.modelId !== 'ZGPSWITCH' ) continue;

			let deviceObj = {
				name			: sensor.name,
				data 			: this.getDeviceData( state.bridge, sensor )
			};

			result.push( deviceObj );

		}

		callback( null, result );

	}

	/*
		Flow methods
	*/
	_onFlowTriggerTapButtonPressed( callback, args, state ) {
		callback( null, args.button === state.button );
	}
}

module.exports = new DriverTap();