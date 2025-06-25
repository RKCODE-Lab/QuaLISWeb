import React from 'react';
import { injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
// import MultiColumnComboSearch from '../../../components/multi-column-combo-search/multi-column-combo-search';
//import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';

const ResultEntryMean = (props) =>{ 
    console.log("props mean:", props);  
       return (<>
           <Row>
               <Col md={12}>

                        {/* {Object.keys(props.selectedMeanTestParam).length > 0 &&
                            <MultiColumnComboSearch data={props.meanTestParameterList}
                                visibility='show-all'
                                labelledBy="IDS_MANUFACTURERNAME"
                                fieldToShow={["stestname", "sparametername", "sresult"]}
                                selectedId={props.selectedRecord["nproductmanufcode"]}
                                value={props.selectedRecord ? [props.selectedRecord] : []}
                                isMandatory={true}
                                showInputkey="smanufname"
                                idslabelfield={["IDS_TEST", "IDS_PARAMETER", "IDS_RESULT"]}
                                getValue={(value) => props.onMultiColumnValue(value, ["nproductmanufcode", "nmanufcode", "nmanufsitecode", "smanufname", "smanufsitename"], true, ["seprotocolname"], ["neprotocolcode"])}
                                singleSelection={true}
                            />
                        } */}

                    {/* <FormMultiSelect
                            name={"testparam"}
                            label={"IDS_PARAMETER"}
                            options={props.meanTestParameterList || []}
                           // optionId={"value"}
                            //optionValue={"label"}
                            constructedOption={true}                            
                            value={props.selectedMeanTestParam ? props.selectedMeanTestParam["testparam"] : ""}
                            isMandatory={true}
                            isClearable={true}
                            disableSearch={false}
                            disabled={false}
                            closeMenuOnSelect={false}
                            alphabeticalSort={true}
                            onChange={(event) => props.onComboChange(event, "testparam")}  />    */}
                        <DataGridWithSelection                               
                                data={props.meanTestParameterList }
                                selectAll={props.addSelectAll}
                                title={props.intl.formatMessage({id:"IDS_PARAMETER"})}
                                headerSelectionChange={props.headerSelectionChange}
                                selectionChange={props.selectionChange}
                                userInfo={props.userInfo}
                                extractedColumnList={[  {idsName:"IDS_TEST", dataField:"stestsynonym", width:"350px"},
                                                        {idsName:"IDS_REPEATRETEST", dataField:"sretestrepeatcount" , width:"150px"},
                                                        {idsName:"IDS_PARAMETER", dataField:"sparametersynonym" , width:"350px"},
                                                        {idsName:"IDS_RESULT", dataField:"sresult" , width:"100px"}]}                             
                        /> 

                    <FormTextarea
                                   name={"parametervalue"}
                                   //label={ props.intl.formatMessage({ id:"IDS_NIBSCCOMMENTS"})}                    
                                   //placeholder={ props.intl.formatMessage({ id:"IDS_NIBSCCOMMENTS"})}
                                   value ={ props.selectedTestParam  || ""}
                                   rows="2"
                                   readOnly ={true}
                                   //isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event)=> props.onInputOnChange(event)}
                                   />

                        <FormInput
                                name={"testmean"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_TESTMEAN"})}                        
                                placeholder={ props.intl.formatMessage({ id:"IDS_TESTMEAN"})}
                                value ={ props.testMean || ""}
                                isMandatory={false}
                                required={false}
                                maxLength={10}
                                isDisabled={true}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />
            </Col>              
        </Row>   
       
      </>
       )
   }
   export default injectIntl(ResultEntryMean);
