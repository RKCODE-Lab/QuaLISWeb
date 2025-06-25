import React from 'react';
import { injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';

import FormInput from '../../../components/form-input/form-input.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormNumericInput from '../../../components/form-numeric-input/form-numeric-input.component';
import MultiColumnComboSearch from '../../../components/multi-column-combo-search/multi-column-combo-search';

const AddBatchCreation = (props) =>{    

    // const disableControlStatus = [transactionStatus.REVIEWED,
    //                               transactionStatus.NULLIFIED, 
    //                               transactionStatus.COMPLETED,
    //                               transactionStatus.SENT,
    //                               transactionStatus.APPROVED,
    //                               transactionStatus.CERTIFIED];


    // const disableControlStatus = [transactionStatus.DRAFT,
    //                             transactionStatus.CORRECTION, 
    //                             transactionStatus.CERTIFICATECORRECTION];
    const disableControlStatus = props.batchCreationEditStatusList || [];
    let disableControl = false;
    const recordStatus = props.selectedRecord && props.selectedRecord.ntransactionstatus;
    if (recordStatus && props.operation === "update"){
        if (disableControlStatus.indexOf(recordStatus) !== -1)
            disableControl = false;
        else
            disableControl = true;
    }
       return (<>
           <Row>                                
                <Col md={6}>
                    <Row>
                         <Col md={12}>
                            <FormSelectSearch
                                    name={"nproductcatcode"}
                                    formLabel={ props.intl.formatMessage({ id:"IDS_PRODUCTCATEGORY"})}                                
                                    placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                                    options={ props.productCategoryList}
                                    value = { props.selectedRecord["nproductcatcode"] || "" }
                                    isMandatory={true}
                                    isClearable={false}
                                    isMulti={false}
                                    isSearchable={true}                               
                                    //isDisabled={false}
                                    isDisabled={disableControl}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, 'nproductcatcode')}                               
                                />
                            <FormSelectSearch
                                    name={"nproductcode"}
                                    formLabel={ props.intl.formatMessage({ id:"IDS_PRODUCT"})}                                
                                    placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                   
                                    options={ props.productList}
                                    value = { props.selectedRecord["nproductcode"]|| "" }
                                    isMandatory={true}
                                    isClearable={false}
                                    isMulti={false}
                                    isSearchable={true}                               
                                    //isDisabled={false}
                                    isDisabled={disableControl}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, 'nproductcode')}                               
                                />
                            <FormInput
                                   name={"schargebandname"}
                                   type="text"
                                   label={ props.intl.formatMessage({ id:"IDS_CHARGEBAND"})}                  
                                   placeholder={ props.intl.formatMessage({ id:"IDS_CHARGEBAND"})}
                                   value ={ props.selectedRecord["schargebandname"] || ""}
                                   isMandatory={false}
                                   required={false}
                                   maxLength={20}
                                   readOnly
                                   onChange={(event)=> props.onInputOnChange(event)}
                              />

                            <FormInput
                                    name={"sdeptname"}
                                    type="text"
                                    label={ props.intl.formatMessage({ id:"IDS_DEPARTMENT"})}                          
                                    placeholder={ props.intl.formatMessage({ id:"IDS_DEPARTMENT"})}
                                    value ={ props.selectedRecord["sdeptname"] || ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={50}
                                    readOnly={true}
                                    onChange={(event)=> props.onInputOnChange(event)}
                                />
                            
                            <FormSelectSearch
                                    name={"nallottedspeccode"}
                                    formLabel={ props.intl.formatMessage({ id:"IDS_STUDYPLAN"})}                                
                                    placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                   
                                    options={ props.studyPlanList}
                                    value = { props.selectedRecord["nallottedspeccode"]  || ""}
                                    isMandatory={true}
                                    isClearable={false}
                                    isMulti={false}
                                    isSearchable={true}                               
                                   // isDisabled={false}
                                    isDisabled={disableControl}
                                    closeMenuOnSelect={true}
                                    onChange = {(event)=> props.onComboChange(event, 'nallottedspeccode')}                               
                                />

                        {Object.keys(props.selectedRecord).length > 0 &&
                            <MultiColumnComboSearch data={props.manufacturerList}
                                visibility='show-all'
                                labelledBy="IDS_MANUFACTURERNAME"
                                fieldToShow={["smanufname", "smanufsitename", "seprotocolname"]}
                                selectedId={props.selectedRecord["nproductmanufcode"]}
                                value={props.selectedRecord ? [props.selectedRecord] : []}
                                isMandatory={true}
                                isDisabled={disableControl}
                                showInputkey="smanufname"
                                idslabelfield={["IDS_MANUFACTURERNAME", "IDS_SITENAME", "IDS_EPROTOCOL"]}
                                getValue={(value) => props.onMultiColumnValue(value, ["nproductmanufcode", "nmanufcode", "nmanufsitecode", "smanufname", "smanufsitename"], true, ["seprotocolname"], ["neprotocolcode"])}
                                singleSelection={true}
                            />
                        }

                            <FormInput
                                    name={"smanufsitename"}
                                    type="text"
                                    label={ props.intl.formatMessage({ id:"IDS_MANUFACTURERSITENAME"})}                          
                                    placeholder={ props.intl.formatMessage({ id:"IDS_MANUFACTURERSITENAME"})}
                                    value ={ props.selectedRecord["smanufsitename"] || ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={50}
                                    readOnly={true}
                                    onChange={(event)=> props.onInputOnChange(event)}
                                />
                            {Object.keys(props.selectedRecord).length > 0 &&
                            <MultiColumnComboSearch data={props.maHolderList}
                                        visibility='show-all'
                                        labelledBy="IDS_MAHOLDERNAME"
                                        fieldToShow={["smahname", "slicencenumber", "sdosagepercontainer"]}
                                        selectedId={[props.selectedRecord["nproductmahcode"]]}
                                        value={props.selectedRecord ? [props.selectedRecord] : []}
                                        showInputkey="smahname"
                                        isMandatory={true}
                                        isDisabled={disableControl}
                                        idslabelfield={["IDS_MAHNAME", "IDS_LICENSENUMBER", "IDS_DOSAGEPERCONTAINER"]}
                                        getValue={(value) => props.onMultiColumnMAHChange(value, ["nproductmahcode", "smahname",
                                                             "slicencenumber", "sdosagepercontainer", "saddress1", "scertificatetype", "scontainertype"])}
                                        singleSelection={true}
                                    />
                            }
                            <FormInput
                                    name={"slicencenumber"}
                                    type="text"
                                    label={ props.intl.formatMessage({ id:"IDS_LICENSENUMBER"})}                          
                                    placeholder={ props.intl.formatMessage({ id:"IDS_LICENSENUMBER"})}
                                    value ={ props.selectedRecord["slicencenumber"] || ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={50}
                                    readOnly={true}
                                    onChange={(event)=> props.onInputOnChange(event)}
                                />

                            <FormInput
                                    name={"scertificatetype"}
                                    type="text"
                                    label={ props.intl.formatMessage({ id:"IDS_CERTIFICATETYPE"})}                          
                                    placeholder={ props.intl.formatMessage({ id:"IDS_CERTIFICATETYPE"})}
                                    value ={ props.selectedRecord["scertificatetype"] || ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={50}
                                    readOnly={true}
                                    onChange={(event)=> props.onInputOnChange(event)}
                                />

                            <FormInput
                                    name={"scontainertype"}
                                    type="text"
                                    label={ props.intl.formatMessage({ id:"IDS_CONTAINERTYPE"})}                          
                                    placeholder={ props.intl.formatMessage({ id:"IDS_CONTAINERTYPE"})}
                                    value ={ props.selectedRecord["scontainertype"]|| ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={50}
                                    readOnly={true}
                                    onChange={(event)=> props.onInputOnChange(event)}
                                />
                        </Col>                   
                   </Row>
               </Col>
               <Col md={6}>   
                    <Row>                   
                        <Col md={12}>

                            <FormInput
                                    name={"saddress1"}
                                    type="text"
                                    label={ props.intl.formatMessage({ id:"IDS_MAHOLDERADDRESS"})}                          
                                    placeholder={ props.intl.formatMessage({ id:"IDS_MAHOLDERADDRESS"})}
                                    value ={ props.selectedRecord["saddress1"] || ""}
                                    isMandatory={false}
                                    required={false}
                                    maxLength={50}
                                    readOnly={true}
                                    onChange={(event)=> props.onInputOnChange(event)}
                                />

                            <FormNumericInput
                                   name={"nnoofcontainer"}
                                   label={ props.intl.formatMessage({ id:"IDS_NOOFCONTAINER"})}                          
                                  // placeholder={ props.intl.formatMessage({ id:"IDS_NOOFCONTAINER"})}
                                   value ={ props.selectedRecord["nnoofcontainer"] || ""}
                                   type="number"                               
                                   strict={true}
                                   maxLength={9}
                                   noStyle={true}
                                   onChange={(event) => props.onNumericInputOnChange(event, "nnoofcontainer")}
                                   precision={0}
                                   min={0}
                                   className="form-control"
                                   isMandatory={true}
                                   required={true}
                                   isDisabled={disableControl}
                                   errors="Please provide a valid number."
                              />

                            <FormInput
                                name={"sbatchfillinglotno"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_BATCHFILINGNUMBER"})}                        
                                placeholder={ props.intl.formatMessage({ id:"IDS_BATCHFILINGNUMBER"})}
                                value ={ props.selectedRecord["sbatchfillinglotno"]  || ""}
                                isMandatory={true}
                                required={true}
                                maxLength={10}
                                isDisabled={disableControl}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />

                            <FormInput
                                name={"spackinglotno"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_PACKINGLOTNUMBER"})}                        
                                placeholder={ props.intl.formatMessage({ id:"IDS_PACKINGLOTNUMBER"})}
                                value ={ props.selectedRecord["spackinglotno"]  || ""}
                                isMandatory={false}
                                required={false}
                                maxLength={10}
                                isDisabled={disableControl}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />

                            <FormInput
                                name={"sfinalbulkno"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_FINALBULKNUMBER"})}                        
                                placeholder={ props.intl.formatMessage({ id:"IDS_FINALBULKNUMBER"})}
                                value ={ props.selectedRecord["sfinalbulkno"]  || ""}
                                isMandatory={true}
                                required={true}
                                maxLength={10}
                                isDisabled={disableControl}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />

                            <FormInput
                                name={"sbatchspecvarinfo"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_BATCHSPECVARINFO"})}                        
                                placeholder={ props.intl.formatMessage({ id:"IDS_BATCHSPECVARINFO"})}
                                value ={ props.selectedRecord["sbatchspecvarinfo"]  || ""}
                                isMandatory={false}
                                required={false}
                                maxLength={10}
                                isDisabled={disableControl}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />

                            <FormTextarea
                                   name={"snibsccomments"}
                                   label={ props.intl.formatMessage({ id:"IDS_NIBSCCOMMENTS"})}                    
                                   placeholder={ props.intl.formatMessage({ id:"IDS_NIBSCCOMMENTS"})}
                                   value ={ props.selectedRecord["snibsccomments"]  || ""}
                                   rows="2"
                                   isMandatory={false}
                                   required={false}
                                   maxLength={255}
                                   onChange={(event)=> props.onInputOnChange(event)}
                                   />

                            <FormInput
                                name={"smanuforderno"}
                                type="text"
                                label={ props.intl.formatMessage({ id:"IDS_MANUFORDERNO"})}                        
                                placeholder={ props.intl.formatMessage({ id:"IDS_MANUFORDERNO"})}
                                value ={ props.selectedRecord["smanuforderno"]  || ""}
                                isMandatory={false}
                                required={false}
                                maxLength={10}
                                isDisabled={disableControl}
                                onChange={(event)=> props.onInputOnChange(event)}
                            />

                            <Row>
                                <Col md={6}>                         
                                    <DateTimePicker
                                                name={"dvaliditystartdate"} 
                                                label={ props.intl.formatMessage({ id:"IDS_VALIDITYSTARTDATEWOTIME"})}                     
                                                className='form-control'
                                                placeholderText="Select date.."
                                                selected={props.selectedRecord["dvaliditystartdate"]}
                                                dateFormat={props.userInfo.ssitedate}
                                                isClearable={false}
                                                isMandatory={true}  
                                                showTimeInput={false}                     
                                                required={true}
                                                isDisabled={disableControl}
                                                maxDate={props.selectedRecord["dvaliditystartdate"]}
                                                maxTime={props.selectedRecord["dvaliditystartdate"]}
                                                onChange={date => props.handleDateChange("dvaliditystartdate", date)}
                                                value={props.selectedRecord["dvaliditystartdate"]}
                                    />
                                </Col>
                                {/* <Col md={6}>
                                        <FormSelectSearch
                                            name={"ntzvaliditystartdate"}
                                            formLabel={ props.intl.formatMessage({ id:"IDS_VALIDITYSTARTTIMEZONE"})}                                
                                            placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                   
                                            options={ props.timeZoneList}
                                            value = { props.selectedRecord["ntzvaliditystartdate"] }
                                            isMandatory={true}
                                            isMulti={false}
                                            isSearchable={true}
                                            isClearable={false}                               
                                            //isDisabled={false}
                                            isDisabled={disableControl}
                                            closeMenuOnSelect={true}
                                            onChange = {(event)=> props.onComboChange(event, 'ntzvaliditystartdate')}                               
                                        />
                                </Col> */}
                                <Col md={6}>
                                        <DateTimePicker
                                                name={"dexpirydate"} 
                                                label={ props.intl.formatMessage({ id:"IDS_EXPIRYDATEWOTIME"})}                     
                                                className='form-control'
                                                placeholderText="Select date.."
                                                selected={props.selectedRecord["dexpirydate"]}
                                                dateFormat={props.userInfo.ssitedate}
                                                isClearable={false}
                                                isMandatory={true}  
                                                showTimeInput={false}                     
                                                required={true}
                                                isDisabled={disableControl}
                                                minDate={props.selectedRecord["dvaliditystartdate"]}
                                                minTime={props.selectedRecord["dvaliditystartdate"]}
                                                onChange={date => props.handleDateChange("dexpirydate", date)}
                                                value={props.selectedRecord["dexpirydate"]}
                                        />
                                </Col>
                                <Col md={6}>
                                        <FormSelectSearch
                                            name={"ntzexpirydate"}
                                            formLabel={ props.intl.formatMessage({ id:"IDS_TIMEZONE"})}                                
                                            placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                   
                                            options={ props.timeZoneList}
                                            value = { props.selectedRecord["ntzexpirydate"] }
                                            isMandatory={true}
                                            isMulti={false}
                                            isSearchable={true}
                                            isClearable={false}                               
                                            //isDisabled={false}
                                            isDisabled={disableControl}
                                            closeMenuOnSelect={true}
                                            onChange = {(event)=> props.onComboChange(event, 'ntzexpirydate')}                               
                                        />     
                                    </Col>
                                </Row>                     
                   </Col>                    
                </Row>  
            </Col>              
        </Row>   
       
      </>
       )
   }
   export default injectIntl(AddBatchCreation);
