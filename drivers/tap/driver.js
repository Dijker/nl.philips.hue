'use strict';

const Homey = require('homey');
const HueDriver = require('../../lib/HueDriver.js');

module.exports = class DriverTap extends HueDriver {
  
  static get HUE_TYPE() {
    return 'sensor';
  }
  
  static onPairGetDevices({ bridge }) {
    return bridge.getSensors.bind(bridge);
  }
  
  static onPairListDevice({ bridge, device }) {
    bridge.log('Tap Device:', device.modelid, device.type, device.name);
    
    if( !['ZGPSwitch'].includes(device.type)) return null;
    return {};
  }
  
  onInitFlow() {
    this.flowCardTriggerTapButtonPressed = new Homey.FlowCardTriggerDevice('tap_button_pressed')
      .register()
      .registerRunListener(async ( args, state ) => {
        return args.button === state.button;
      });
  }
}