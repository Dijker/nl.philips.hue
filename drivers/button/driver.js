'use strict';

const Homey = require('homey');
const HueDriver = require('../../lib/HueDriver.js');

module.exports = class DriverButton extends HueDriver {
  
  static get HUE_TYPE() {
    return 'sensor';
  }
  
  static onPairGetDevices({ bridge }) {
    return bridge.getSensors.bind(bridge);
  }
  
  static onPairListDevice({ bridge, device }) {
    bridge.log('Button Device:', device.modelid, device.type, device.name);
    
    if( !['ROM001'].includes(device.modelid)) return null;
    return {};
  }
  
  onInitFlow() {
    this.flowCardTriggerButtonButtonPressed = new Homey.FlowCardTriggerDevice('button_button_pressed')
      .register();
      
    this.flowCardTriggerButtonButtonHeld = new Homey.FlowCardTriggerDevice('button_button_held')
      .register();
      
    this.flowCardTriggerButtonButtonReleased = new Homey.FlowCardTriggerDevice('button_button_released')
      .register();
  }
}