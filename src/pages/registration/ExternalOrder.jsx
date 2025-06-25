import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';
import FormInput from '../../components/form-input/form-input.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



const ExternalOrder = (props)=>{

    function onOrderSearchEvent (event){
        if (event.keyCode === 13) {
            const inputValue = event.target.value;
            if (inputValue !== "") {
                props.onOrderSearch(inputValue);
            }
        }
    }
   
                    const extractedColumnList = [];
                           
                            extractedColumnList.push({"idsName":"IDS_ORDERSAMPLEID","dataField":"sexternalsampleid", "width": "155px"});
                            extractedColumnList.push({"idsName":"IDS_EXTERNALORDER","dataField":"sexternalorderid", "width": "155px"} );
                    return (
                    <Row>
                    {/* <Col md={12}>   */}
                    <Col md={6}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_EXTERNALORDERTYPE" })}
                        isSearchable={true}
                        name={"nexternalordertypecode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={props.externalOrderTypeList || []}
                        optionId='nexternalordertypecode'
                        optionValue='sexternalordertypename'
                        value={props.selectedRecord["nexternalordertypecode"] ? props.selectedRecord["nexternalordertypecode"] : ""}
                        // defaultValue={props.selectedRecord["selectedExternalOrderType"]}
                        onChange={(event) => props.onComboChange(event, 'nexternalordertypecode')}
                        //isMulti={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                    />
                    </Col>
                    <Col md={6}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_ORDERSAMPLEID" })}
                        name= "sexternalorderid"
                        type="text"
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_ENTERNALORDERSAMPLENO" })}
                        value={props.selectedRecord["sexternalorderid"] ? props.selectedRecord["sexternalorderid"] : ""}
                        onKeyUp={onOrderSearchEvent}
                        isMandatory={true}
                        required={false}
                        maxLength={100}
                    />   
                    </Col>
                    {/* </Col> */}

                        <Col>                     
                        <DataGridWithSelection                               
                                data={props.orders} 
                                selectAll={props.addSelectAll|| false}
                                userInfo={props.userInfo}
                                title={props.intl.formatMessage({id:"IDS_SELECTTOADD"})}
                                selectionChange={props.selectionChange}
                                headerSelectionChange={props.headerSelectionChange}
                                extractedColumnList={extractedColumnList}                            
                        /> 
                </Col>
                    </Row>
                    );
            }
            
    
export default  injectIntl(ExternalOrder);