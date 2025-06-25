import * as React from 'react';
import { SchedulerForm } from '@progress/kendo-react-scheduler';
import  CustomFormEditor  from './custom-form-editor';
import { CustomDialog } from './custom-dialog';
import {intl} from '../../components/App'

export const FormWithCustomEditor = props => {
  const requiredValidator = React.useCallback(value => value === -1|| value === undefined||value === null ? intl.formatMessage({ id:"IDS_FIELDISREQUIRED."}):undefined , []);
  const formValidator = (_dataItem, formValueGetter) => {
    let result = {};
     if(_dataItem.InstrumentCategory&&_dataItem.InstrumentCategory!==undefined&&_dataItem.InstrumentCategory!==-1&&(_dataItem.Instrument===undefined||_dataItem.Instrument===null)){
       result.Instrument = [requiredValidator(_dataItem.Instrument)].filter(Boolean)
       .reduce((current, acc) => current || acc, "");;
     }
  
    return result;
  };
  return <SchedulerForm    {...props} editor={CustomFormEditor} dialog={CustomDialog} validator={formValidator}
   />;
};