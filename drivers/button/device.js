'use strict';

const Homey = require('homey');
const HueDevice = require('../../lib/HueDevice.js');

module.exports = class DeviceButton extends HueDevice {
    
  onPoll({ device }) {   
    super.onPoll(...arguments);
    if(!device.state) return;
    
    let lastupdated = device.state.lastupdated;
    let buttonevent = device.state.buttonevent;
        
    // Initial load, don't trigger a Flow when the app has just started
    if( typeof this.lastupdated === 'undefined' ) {
      this.lastupdated = lastupdated;
      this.buttonevent = buttonevent;
    } else {

      // if last press changed and button is the same
      if( lastupdated !== this.lastupdated ) {
        
        if( buttonevent === 1002 || buttonevent === 1000 ) {
          this.driver.flowCardTriggerButtonButtonPressed
            .trigger(this)
            .catch(this.error);
        } else if( buttonevent === 1001 && buttonevent !== this.buttonevent ) {
          this.driver.flowCardTriggerButtonButtonHeld
            .trigger(this)
            .catch(this.error);
        } else if( buttonevent === 1003 && buttonevent !== this.buttonevent ) {
          this.driver.flowCardTriggerButtonButtonReleased
            .trigger(this)
            .catch(this.error);
        }
        
        this.lastupdated = lastupdated;
        this.buttonevent = buttonevent;
      }
      
    }
  }
  
}