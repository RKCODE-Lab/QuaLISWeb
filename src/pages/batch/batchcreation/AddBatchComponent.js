import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {Button,Row, Col} from 'react-bootstrap';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import {transactionStatus} from '../../../components/Enumeration';
import CustomSwitch from '../../../components/custom-switch/custom-switch.component';
import DataGridWithSelection from '../../../components/data-grid/DataGridWithSelection';


const AddBatchComponent = (props) =>{    
       return (<>
            <Row>                                
                <Col md={3}>                  
                        <FormSelectSearch
                                name={"nproductcatcode"}
                                formLabel={ props.intl.formatMessage({ id:"IDS_PRODUCTCATEGORY"})}                                
                                placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                                options={ props.productCategoryList}
                                value = { props.selectedRecord["nproductcatcode"] || "" }
                                isMandatory={false}
                                isClearable={false}
                                isMulti={false}
                                isSearchable={true}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange = {(event)=> props.getProductByCategory(event, 'nproductcatcode')}                               
                            />
                </Col>
                <Col md={3}>
                        <FormSelectSearch
                                name={"nproductcode"}
                                formLabel={ props.intl.formatMessage({ id:"IDS_PRODUCT"})}                                
                               placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                                
                                options={ props.productList}
                                value = { props.selectedRecord["nproductcode"]|| "" }
                                isMandatory={false}
                                isClearable={true}
                                isMulti={false}
                                isSearchable={true}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange = {(event)=> props.onComboChange(event, 'nproductcode')}                               
                            />
                </Col>
                <Col md={3}>
                        <FormSelectSearch
                                name={"ncomponentcode"}
                                formLabel={ props.intl.formatMessage({ id:"IDS_COMPONENT"})}                                
                                placeholder={ props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                               
                                options={ props.componentList}
                                value = { props.selectedRecord["ncomponentcode"]  || ""}
                                isMandatory={false}
                                isClearable={true}
                                isMulti={false}
                                isSearchable={true}                               
                                isDisabled={false}
                                closeMenuOnSelect={true}
                                onChange = {(event)=> props.onComboChange(event, 'ncomponentcode')}                               
                            />
                </Col>
                <Col md={3}>
                        <FormInput
                            name={"smanuflotno"}
                            type="text"
                            label={ props.intl.formatMessage({ id:"IDS_MANUFLOTNO"})}                        
                            placeholder={ props.intl.formatMessage({ id:"IDS_MANUFLOTNO"})}
                            value ={ props.selectedRecord["smanuflotno"]}
                            isMandatory={false}
                            required={false}
                            maxLength="100"
                            onChange={(event)=> props.onInputOnChange(event)}
                        />  
                </Col>
                <Col md={3}>

                        <CustomSwitch
                                name={"dateprompt"}
                                type="switch"
                                label={ props.intl.formatMessage({ id:"IDS_DONOTPROMPTDATE"})}
                                placeholder={ props.intl.formatMessage({ id:"IDS_DONOTPROMPTDATE"})}                            
                                defaultValue ={ props.selectedRecord["dateprompt"] === transactionStatus.YES ? true :false }  
                                isMandatory={false}                       
                                required={false}
                                checked={ props.selectedRecord["dateprompt"] === transactionStatus.YES ? true :false}
                                onChange={(event)=> props.onInputOnChange(event)}
                                />
                </Col>
                <Col md={3} className={'pt-3'}>
                        <DateTimePicker
                                    name={"transdatefrom"} 
                                    label={ props.intl.formatMessage({ id:"IDS_DATEFROM"})}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord["transdatefrom"]}
                                    dateFormat={props.userInfo.ssitedate}
                                    isClearable={false}
                                    isMandatory={false}                       
                                    required={false}
                                    isDisabled = {props.selectedRecord["dateprompt"] === transactionStatus.YES}
                                    onChange={date => props.handleDateChange("transdatefrom", date)}
                                    value={props.selectedRecord["transdatefrom"]}
                            />
                </Col>
                <Col md={3} className={'pt-3'}>
                        <DateTimePicker
                                    name={"transdateto"} 
                                    label={ props.intl.formatMessage({ id:"IDS_DATETO"})}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord["transdateto"]}
                                    dateFormat={props.userInfo.ssitedate}
                                    isClearable={false}
                                    isMandatory={false}                       
                                    required={false}
                                isDisabled = {props.selectedRecord["dateprompt"] === transactionStatus.YES}
                                    onChange={date => props.handleDateChange("transdateto", date)}
                                    value={props.selectedRecord["transdateto"]}
                            />             
                
                 </Col>  
                 <Col md={3} className={'pt-3'}>
                        <Button variant="outline-danger" onClick={()=>props.clearComponentInput()}>
                            <FormattedMessage id='IDS_CLEAR' defaultMessage='Clear' />
                        </Button> 
                        <Button className={'ml-2'}variant="outline-primary" onClick={() => props.getDataForAddComponent(props.selectedRecord)}>
                                <FormattedMessage id='IDS_GETCOMPONENTS' defaultMessage='Get Components' />
                        </Button>
{/* 
                        <Nav.Link name="addrole" className="add-txt-btn" 
                                onClick={() => props.getDataForAddComponent(props.selectedRecord)}>
                        
                        <FormattedMessage id='IDS_GETCOMPONETS' defaultMessage='Get Components' />
                        </Nav.Link> */}

                        {/* <Button className="btn-user btn-cancel" variant="" 
                                onClick={() => props.getDataForAddComponent(props.selectedRecord)}
                                >
                        <FormattedMessage id='IDS_GETCOMPONETS' defaultMessage='Get Components' />
                    </Button>                    */}
                 </Col>
                 {/* <Col md={3}>
                    <span className="add-txt-btn">
                        {props.addComponentDataList && props.addComponentDataList.length > 0 && 
                        props.addedComponentList && `${props.addedComponentList.length}
                        ${props.intl.formatMessage({id:"IDS_COMPONENTSSELECTED"})}`}
                     </span>
                </Col>           */}
                {/* <Col className="d-flex justify-content-end" md={12}>
                        <Button variant="outline-secondary" onClick={() => props.getDataForAddComponent(props.selectedRecord)}>
                                <FormattedMessage id='IDS_GETCOMPONETS' defaultMessage='Get Components' />
                        </Button>
                </Col>         */}
        </Row>   
        <Row style={{marginTop:'10px'}}>
                <Col>                     
                        <DataGridWithSelection                               
                                data={props.addComponentDataList }
                                selectAll={props.addSelectAll}
                                title={props.intl.formatMessage({id:"IDS_SELECTTOADD"})}
                                headerSelectionChange={props.headerSelectionChange}
                                selectionChange={props.selectionChange}
                                extractedColumnList={[  {idsName:"IDS_ARNO", dataField:"sarno"},
                                                        {idsName:"IDS_COMPONENTNAME", dataField:"scomponentname"},
                                                        {idsName:"IDS_BATCHLOTNO", dataField:"smanuflotno"},
                                                        {idsName:"IDS_SPECNAME", dataField:"sspecname"}]}                             
                        /> 
                </Col>
        </Row>
        <Row style={{marginTop:'10px'}}>
                {/* <Col md={6}>
                        <span className="add-txt-btn">
                                <FormattedMessage id="IDS_ADDEDCOMPONENTS" defaultMessage="Added Components"/>
                                 : {props.addedComponentList && props.addedComponentList.length}
                        </span>
                </Col> */}

                <Col md={12} className="d-flex justify-content-end">
                     
                        <Button variant="outline-danger" onClick={() => props.onDeleteSelectedComponent()} >
                                <FormattedMessage id='IDS_REMOVECOMPONENTS' defaultMessage='Remove Components' />
                        </Button>
                        {/* <Nav.Link name="addrole" className="add-txt-btn" onClick={() => props.onDeleteSelectedComponent()}>
                                <FormattedMessage id='IDS_DELETECOMPONENTS' defaultMessage='Delete Components' />
                        </Nav.Link> */}
                </Col>
        </Row>
        <Row style={{marginTop:'10px'}}> 
                 <Col>      
                        <DataGridWithSelection
                                primaryKeyField={"nbatchcompcode"}                               
                                data={props.addedComponentList }
                                selectAll={props.deleteSelectAll}
                                title={props.intl.formatMessage({id:"IDS_SELECTTODELETE"})}
                                headerSelectionChange={props.addedHeaderSelectionChange}
                                selectionChange={props.addedSelectionChange}
                                extractedColumnList={[  {idsName:"IDS_ARNO", dataField:"sarno"},
                                                        {idsName:"IDS_COMPONENTNAME", dataField:"scomponentname"},
                                                        {idsName:"IDS_BATCHLOTNO", dataField:"smanuflotno"},
                                                        {idsName:"IDS_SPECNAME", dataField:"sspecname"}]}
                              
                        /> 
                </Col>
        </Row>
      
       
        </>
       )
   }
   export default injectIntl(AddBatchComponent);
