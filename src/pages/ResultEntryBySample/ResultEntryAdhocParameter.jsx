import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { transactionStatus } from '../../components/Enumeration';



class ResultEntryAdhocParameter extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
    render(){
        return(
            <>
             <Row>
            <Col md={12}>
                <FormMultiSelect
                    name={"ntestparametercode"}
                    label={ this.props.intl.formatMessage({ id:"IDS_ADHOCPARAMETER" })}                              
                    options={ this.props.adhocParamter|| []}
                    optionId="value"
                    optionValue="label"
                            value={this.state.selectedRecordAdhocParameter && this.state.selectedRecordAdhocParameter["nparamtercode"] !== undefined ?
                                this.state.selectedRecordAdhocParameter["nparamtercode"] || [] : this.props.selectedRecordAdhocParameter &&
                                    this.props.selectedRecordAdhocParameter["nparamtercode"] ? this.props.selectedRecordAdhocParameter["nparamtercode"] || [] : []}
                    isMandatory={true}                                               
                    isClearable={true}
                    disableSearch={false}                                
                    disabled={false}
                    closeMenuOnSelect={false}
                    alphabeticalSort={true}
                    allItemSelectedLabel={this.props.intl.formatMessage({ id:"IDS_ALLITEMSAREMSELECTED" })}
                    noOptionsLabel={this.props.intl.formatMessage({ id:"IDS_NOOPTION" })}
                    searchLabel={this.props.intl.formatMessage({ id:"IDS_SEARCH" })}
                    selectAllLabel={this.props.intl.formatMessage({ id:"IDS_SELECTALL" })}
                    onChange = {(event)=> this.onComboChange(event, "nparamtercode")}
                />
            </Col>

            <Col md={12}>
                <CustomSwitch
                    label={this.props.intl.formatMessage({ id: "IDS_VISIBLETESTINTESTGROUP" })}
                    type="switch"
                    name={"nvisibleadhocparameter"}
                    onChange={(event) => this.onInputOnChange(event,"nvisibleadhocparameter")}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_VISIBLETESTINTESTGROUP" })}
                            defaultValue={this.state.selectedRecordAdhocParameter && this.state.selectedRecordAdhocParameter["nvisibleadhocparameter"] !==undefined?
                            this.state.selectedRecordAdhocParameter["nvisibleadhocparameter"] === transactionStatus.YES ? true : false :
                            this.props.selectedRecordAdhocParameter && this.props.selectedRecordAdhocParameter["nvisibleadhocparameter"]=== transactionStatus.YES ? true : false}
                    isMandatory={false}
                    required={false}
                            checked={this.state.selectedRecordAdhocParameter && this.state.selectedRecordAdhocParameter["nvisibleadhocparameter"] !==undefined?
                                this.state.selectedRecordAdhocParameter["nvisibleadhocparameter"] === transactionStatus.YES ? true : false :
                                this.props.selectedRecordAdhocParameter && this.props.selectedRecordAdhocParameter["nvisibleadhocparameter"]=== transactionStatus.YES ? true : false}
                />
            </Col>
              
        </Row>

            </>
        )
    }
    componentDidUpdate(previousProps,previousState ) { 
        if(this.props.selectedRecordAdhocParameter!==previousProps.selectedRecordAdhocParameter ){ 
            this.setState({ selectedRecordAdhocParameter:this.props.selectedRecordAdhocParameter });
        } 
    }

    onInputOnChange = (event,name) => {
        const selectedRecordAdhocParameter = this.state.selectedRecordAdhocParameter || {};
        if (event.target.type === 'checkbox') {
            selectedRecordAdhocParameter[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecordAdhocParameter[event.target.name] = event.target.value;
        }
        this.props.onAdhocParameterInputChange(event,name);
        this.setState({ selectedRecordAdhocParameter });
    }

    onComboChange = (comboData, comboName) => {
        const selectedRecordAdhocParameter = this.state.selectedRecordAdhocParameter || [];
        if (comboData) { 
            selectedRecordAdhocParameter[comboName] = comboData; 
        } else {
            selectedRecordAdhocParameter[comboName] = [] 
        }
        this.props.onAdhocParameterComboChange(comboData, comboName);
        this.setState({ selectedRecordAdhocParameter });
    }

}

export default (injectIntl(ResultEntryAdhocParameter));
