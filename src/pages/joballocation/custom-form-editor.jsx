import * as React from 'react';
import { FormElement, Field } from '@progress/kendo-react-form';
import { Label, Error } from '@progress/kendo-react-labels';
import { TextArea } from '@progress/kendo-react-inputs';
import { DatePicker, DateTimePicker } from '@progress/kendo-react-dateinputs';
import { Instrument } from './editors';
import  InstrumentCategory from './editors';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import InstrumentName from './InstrumentName';


const mapStateToProps = state => {
  return ({ Login: state.Login })
}

 function CustomFormEditor (props) {
  return <FormElement horizontal={true}>
     <div className="k-form-field">
      <Label>
     {props.intl.formatMessage({ id: "IDS_STARTDATE" })} 
      </Label>
      <div className="k-form-field-wrap">
    
          <Field name={'start'} component={props.startEditor || DatePicker} as={DateTimePicker} rows={1}   />
          &nbsp;
        
      </div>

    </div>

    <div className="k-form-field">
      <Label>
      {props.intl.formatMessage({ id: "IDS_ENDDATE" })} 
      </Label>
      <div className="k-form-field-wrap">
    
      <Field name={'end'} component={props.endEditor || DatePicker} as={DateTimePicker} rows={1} />
          &nbsp;
        
      </div>

    </div>

        {/* <div className="k-form-field">
      <Label>
        Start Date
      </Label>
      <div className="k-form-field-wrap">
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Field name={'start'} component={props.startEditor || DatePicker} as={DateTimePicker} rows={1} width={'140px'} format="t" />
          &nbsp;
          <Label>
            End Date
          </Label>
          &nbsp;
          <Field name={'end'} component={props.endEditor || DatePicker} as={DateTimePicker} rows={1} width={'140px'} format="t" />
        </div>
      </div>
    </div> */}
    <div className="k-form-field">
      <Label>
      {props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })} 
      </Label>
      <div className="k-form-field-wrap">
        <Field name={'InstrumentCategory'}   instrumentCat={props.Login.InstrumentCategory?props.Login.InstrumentCategory:[]} component={InstrumentCategory} />
        {/* {props.errors.InstrumentCategory && <Error>{props.errors.InstrumentCategory}</Error>} */}
      </div>

    </div>

    <div className="k-form-field">
      <Label>
      {props.intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })} 
      </Label>
      <div className="k-form-field-wrap">
        <Field name={'InstrumentName'} selectedInstrumentCatCode={props.Login.selectedInstrumentCatCode}  InstrumentName={props.Login.InstrumentName?props.Login.InstrumentName:[]} component={InstrumentName} />
        {/* {props.errors.InstrumentCategory && <Error>{props.errors.InstrumentCategory}</Error>} */}
      </div>

    </div>

    <div className="k-form-field">
      <Label>
      {props.intl.formatMessage({ id: "IDS_INSTRUMENT" })} 
      </Label>
      <div className="k-form-field-wrap">
        <Field name={'Instrument'} instrument={props.Login.Instrument?props.Login.Instrument:[]}  component={Instrument} />
        {props.errors.Instrument && <Error>{props.errors.Instrument}</Error>}
      </div>
    </div>
    <div className="k-form-field">
      <Label>
      {props.intl.formatMessage({ id: "IDS_COMMENTS" })} 
      </Label>
      <div className="k-form-field-wrap">
        <Field name={'description'} component={TextArea} rows={1} />
      </div>
    </div>

    
  </FormElement>;
};

export default connect(mapStateToProps)(injectIntl(CustomFormEditor));