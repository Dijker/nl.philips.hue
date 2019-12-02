'use strict';

const Homey = require('homey');
const HueDevice = require('../../lib/HueDevice.js');

const BUTTON_EVENT_MAP_ZGPSWITCH = {
  '34': 'button1',
  '16': 'button2',
  '17': 'button3',
  '18': 'button4',  
}

const BUTTON_EVENT_MAP_FOHSWITCH = {
  '20': 'button1',
  '21': 'button2',
  '22': 'button3',
  '23': 'button4',
};

module.exports = class DeviceTap extends HueDevice {
    
  onPoll({ device }) {   
    super.onPoll(...arguments);
    if(!device.state) return;

    // map hue json values to a variable
    let lastupdated = device.state.lastupdated;
    let buttonevent = device.state.buttonevent;
    let modelid = device.modelid;

    // modelid options: "ZGPSWITCH" (Hue Tap Switch), "FOHSWITCH" (Friends of Hue Switch)
    let button_event_map;
    switch (modelid) {
      case "ZGPSWITCH":
          button_event_map = BUTTON_EVENT_MAP_ZGPSWITCH;
          break;
      case "FOHSWITCH":
          button_event_map = BUTTON_EVENT_MAP_FOHSWITCH;
          break;
      default:
    }
        
    // Initial load, don't trigger a Flow when the app has just started
    if( typeof this.buttonevent === 'undefined' ) {
      this.lastupdated = lastupdated;
      this.buttonevent = buttonevent;
      this.modelid = modelid;
    } else {

      // if last press changed and button is the same
      if( lastupdated !== this.lastupdated && buttonevent === this.buttonevent ) {
        this.lastupdated = device.state.lastupdated;
        
        const button = button_event_map[buttonevent];
        this.log(`Same button pressed [${buttonevent}]:`, button);
        
        if( button ) {        
          this.driver.flowCardTriggerTapButtonPressed
            .trigger(this, {}, { button })
            .catch(this.error);
        }
      }

      // else if the button has changed
      else if( this.buttonevent !== buttonevent ) {
        this.buttonevent = buttonevent;
        this.lastupdated = lastupdated;
        
        const button = button_event_map[buttonevent];
        this.log(`New button pressed [${buttonevent}]:`, button);
        
        if( button ) {
          this.driver.flowCardTriggerTapButtonPressed
            .trigger(this, {}, { button })
            .catch(this.error);
        }
      }
    }
    
    // cleanup
    device = null;
    buttonevent = null;
    lastupdated = null;
    modelid = null;
    button_event_map = null;
  }
  
}