import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { connect } from 'react-redux';
import {getInstrumentForSchedule} from '../../actions'
const mapStateToProps = state => {
    return ({ Login: state.Login })
  }
 const InstrumentName = props => {
    const handleChange = event => {
      if (props.onChange) {
        props.onChange.call(undefined, {
          value: event.value.value
        });
        props.getInstrumentForSchedule(props.selectedInstrumentCatCode,event.value.value,props.Login.userInfo);
  
      }
    };
    return <DropDownList onChange={handleChange} value={props.value?props.InstrumentName.find(p => p.value === props.value):""} 
    data={props.InstrumentName} dataItemKey={'value'} textField={'label'} />;
  };
  
  export default  connect(mapStateToProps,{getInstrumentForSchedule})(InstrumentName);
  