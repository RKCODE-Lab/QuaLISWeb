import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { connect } from 'react-redux';
import {getInstrumentNameForSchedule} from '../../actions'
const mapStateToProps = state => {
  return ({ Login: state.Login })
}

 const InstrumentCategory = props => {
  const handleChange = event => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.value
      });
     // props.getInstrumentForSchedule(event.value.value,props.Login.userInfo);

      props.getInstrumentNameForSchedule(event.value.value, props.Login.userInfo);

    }
  };
  return <DropDownList onChange={handleChange} value={props.value?props.instrumentCat.find(p => p.value === props.value):""} data={props.instrumentCat} dataItemKey={'value'} textField={'label'} />;
};

export default connect(mapStateToProps,{getInstrumentNameForSchedule})(InstrumentCategory);




export const Instrument = props => {
  const handleChange = event => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.value
      });
    }
  };
  return <DropDownList onChange={handleChange} 
  value={props.instrument.find(t => t.value === props.value)} data={props.instrument} 
  dataItemKey={'value'} textField={'label'} />;
};



