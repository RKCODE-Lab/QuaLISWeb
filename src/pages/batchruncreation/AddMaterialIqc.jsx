import React from 'react';
import { connect } from 'react-redux';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { intl } from '../../components/App';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { Row, Col,Nav,FormGroup, FormLabel,Card,Modal,Form,Button} from 'react-bootstrap';
import { HeaderSpan } from '../registration/registration.styled';
import { MediaHeader } from '../../components/App.styles';
import FormInput from '../../components/form-input/form-input.component';
import {faPlus,faSave } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReadOnlyText } from '../../components/App.styles';
import { ModalInner } from '../../components/App.styles';
import AddSpecification from '../registration/AddSpecification';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { transactionStatus, formCode } from '../../components/Enumeration';
import { updateStore } from '../../actions';

class AddMaterialIqc extends React.Component {
    constructor(props) {
        super(props);
        this.formElement = React.createRef();
        this.myRef = React.createRef()
       //formRef = React.createRef();
    }
    formRef = React.createRef();

   

    render() {
        return(
            <>
                <Row>
                       <Col md={6}>
                                 <Row>
                                     <Col md={12}>
                                         <FormSelectSearch
                                             formLabel={intl.formatMessage({ id: "IDS_MATERIALTYPE" })}
                                             placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                             isSearchable={false}
                                             name={"nmaterialtypecode"}
                                             isDisabled={true}
                                             isMandatory={true}
                                             options={this.props.materialType || []}
                                             value={this.props.selectedMaterialType ? this.props.selectedMaterialType : ""}
                                             showOption={true}
                                             required={true}
                                             onChange={(event) => this.props.onMaterialComboChange(event, 'nmaterialtypecode')}
                                             isMulti={false}
                                             closeMenuOnSelect={true}
                                         />
                                         <FormSelectSearch
                                             formLabel={intl.formatMessage({ id: "IDS_MATERIALCATEGORY" })}
                                             placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                             isSearchable={false}
                                             name={"nmaterialcatcode"}
                                             isDisabled={false}
                                             isMandatory={true}
                                             options={this.props.materialCategory || []}
                                             value={this.props.selectedMaterialCategory ? this.props.selectedMaterialCategory : ""}
                                             showOption={true}
                                             required={true}
                                             onChange={(event) => this.props.onComboChange(event, 'smaterialcatname')}
                                             isMulti={false}
                                             closeMenuOnSelect={true}
                                         />
                                         <FormSelectSearch
                                             formLabel={intl.formatMessage({ id: "IDS_MATERIAL" })}
                                             placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                             isSearchable={false}
                                             name={"nmaterialcode"}
                                             isDisabled={false}
                                             isMandatory={true}
                                             options={this.props.material || []}
                                             value={this.props.selectedMaterial ? this.props.selectedMaterial : ""}
                                             showOption={true}
                                             required={true}
                                             onChange={(event) => this.props.onComboChange(event, 'smaterialname')}
                                             isMulti={false}
                                             closeMenuOnSelect={true}
                                         />
                                         <FormSelectSearch
                                             formLabel={intl.formatMessage({ id: "IDS_MATERIALINVENTORY" })}
                                             placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                             isSearchable={false}
                                             name={"nmaterialinventtranscode"}
                                             isDisabled={false}
                                             isMandatory={true}
                                             options={this.props.materialInventory || []}
                                             value={this.props.selectedMaterialInventory ? this.props.selectedMaterialInventory : ""}
                                             showOption={true}
                                             required={true}
                                             onChange={(event) => this.props.onComboChange(event, 'sinventoryid')}
                                             isMulti={false}
                                             closeMenuOnSelect={true}
                                         />
                                     </Col>
                                 </Row>
                             </Col>
                             <Col md={6}>
                                 <Row>
                                     <Col md={12}>
                                         <FormInput
                                             label={intl.formatMessage({ id: "IDS_AVAILABLEQUANTITY" })}
                                             name="savailablequantity"
                                             type="text"
                                             maxLength="100"
                                             isMandatory={true}
                                             value={this.props.selectedInventoryUnit != null ? this.props.selectedInventoryUnit["savailablequatity"] :""}
                                             onChange={(event) => this.props.onInputOnChange(event)}
                                             placeholder={this.props.intl.formatMessage({ id: "IDS_AVAILABLEQUANTITY" })}
                                             isDisabled={true}
                                         />
                                     </Col>
                                     <Col md={6}>
                                         <FormInput
                                             label={this.props.intl.formatMessage({ id: "IDS_USEDQTY" })}
                                             name="susedquantity"
                                             type="text"
                                             maxLength="100"
                                             isMandatory={true}
                                             value={this.props.selectedRecord && this.props.selectedRecord["susedquantity"] ? this.props.selectedRecord["susedquantity"]:""}
                                             onChange={(event) => this.props.onInputOnChange(event)}
                                             placeholder={this.props.intl.formatMessage({ id: "IDS_USEDQTY" })}
                                         />
                                     </Col>
                                     <Col md={6}>
                                         <FormInput
                                             label={this.props.intl.formatMessage({ id: "IDS_UNIT" })}
                                             name="sunitname"
                                             type="text"
                                             maxLength="100"
                                             isMandatory={true}
                                             value={this.props.selectedInventoryUnit != null ? this.props.selectedInventoryUnit["sunitname"] :""}
                                             onChange={(event) => this.props.onInputOnChange(event)}
                                             placeholder={this.props.intl.formatMessage({ id: "IDS_UNIT" })}
                                             isDisabled={true}
                                         />
                                     </Col>
                                     <Col md={12}>
                                         <FormTextarea
                                             label={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                             name="sremarks"
                                             type="text"
                                             onChange={(event) => this.props.onInputOnChange(event)}
                                             placeholder={this.props.intl.formatMessage({ id: "IDS_REMARKS" })}
                                             value={this.props.selectedRecord ? this.props.selectedRecord["sremarks"] : ""}
                                             isMandatory={false}
                                             required={false}
                                             maxLength={255}
                                             row={2}
                                         />
                                     </Col>
                                 </Row>
                             </Col>
                         </Row>
            
                          <Row>
                                 <Col md={12} className="p-0">
                                      <div className="actions-stripe">
                                          <div className="d-flex justify-content-end">
                                              <HeaderSpan className='pl-3'>
                                                  <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' /></HeaderSpan>
                                                      { this.props.operation==="createiqcsample"?
                                                          <Nav.Link className="add-txt-btn text-right"
                                                                 onClick={(e) => this.props.AddSpec(e)}
                                                             >
                                                             <FontAwesomeIcon icon={faPlus} /> { }{ }
                                                             <FormattedMessage id='IDS_SPECIFICATION' defaultMessage='Specification' />
                                                             </Nav.Link>:
                                                               <Nav.Link className="add-txt-btn texgetChildValuest-right"
                                                                 onClick={(e) => this.props.AddSpec(e)}
                                                           >
                                                             <div>
                                                                {" "}
                                                                   </div>
                                                                {""}
                                                     </Nav.Link> }
                                                 </div>
                                             </div>
                                         </Col>
            
                                         <Col md={12}>
                                             <Row>
                                                 <Col md={6}>
                                                     <FormGroup>
                                                         <FormLabel><FormattedMessage id="IDS_SPECIFICATION" message="Specification" /></FormLabel>
                                                          <ReadOnlyText>
                                                            {this.props.selectedSpec && this.props.selectedSpec["nallottedspeccode"] ? this.props.selectedSpec["nallottedspeccode"].label:"-"}
                                                          </ReadOnlyText>
                                                     </FormGroup>
                                                 </Col>
                                                 <Col md={6}>
                                                     <FormGroup>
                                                         <FormLabel><FormattedMessage id="IDS_VERSION" message="Version" /></FormLabel>
                                                         <ReadOnlyText>
                                                             {this.props.selectedSpec && this.props.selectedSpec["sversion"] ? this.props.selectedSpec["sversion"] : "-"} 
                                                         </ReadOnlyText>
                                                     </FormGroup>
                                                 </Col>
                                             </Row>
                                         </Col> 
                                    </Row>
                    { this.props.loadSpec ?
                         <Modal
                            size= {'lg'}
                            backdrop="static"
                            className={this.props.loadCustomSearchFilter ? 'wide-popup' : this.props.className || ""}
                            show={this.props.openSpecModal}
                            onHide={this.props.closeModal}
                            enforceFocus={false}
                            dialogClassName="modal-dialog-slideout freakerstop"
                            aria-labelledby="add-user"> 
                    {/* <Modal.Header className="d-flex align-items-center mb-2"> */}
                    <Modal.Header className="d-flex align-items-center">
                        <Modal.Title id="add-user" className="header-primary flex-grow-1">
                                {this.props.operation ?
                                    <>
                                        <FormattedMessage id={this.props.operation && "IDS_".concat(this.props.operation.toUpperCase())}
                                        defaultMessage='Add' />
                                        {" "}
                                        {
                                            this.props.screenName ?
                                            <FormattedMessage id={this.props.screenName} />
                                            : ""
                                        }
                                    </>
                                    :
                                        <FormattedMessage id={this.props.screenName} />
                                    }
                                        
                        </Modal.Title>
                        <Button className="btn-user btn-cancel" variant="" 
                        onClick={this.props.closeModal}>
                        <FormattedMessage id='IDS_CANCEL' defaultMessage='Cancel' />
                        </Button> 

                        {/* <Button className="btn-user btn-primary-blue" onClick={() => this.handleSaveClick(3)}>
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_SUBMIT' defaultMessage='Submit' />
                        </Button>  */}
                        {/* : this.props.Login.loadEsign === true && this.props.Login.operation === "update" ?
                                                <Button className=" btn-user btn-primary-blue" onClick={() => this.handleSaveClick(3)}>
                                                    <FontAwesomeIcon icon={faSave} /> { }
                                                    <FormattedMessage id={idsLabel} defaultMessage={buttonLabel} />
                                                </Button> */}
            
                         <Button className="btn-user btn-primary-blue"
                                onClick={() => this.props.handleSaveClick(1)}>
                                <FontAwesomeIcon icon={faSave} /> { }
                                <FormattedMessage id='IDS_SAVE' defaultMessage='Save' />
                        </Button> 
                        
                       </Modal.Header>
                
                                <Modal.Body className='popup-fixed-center-headed-full-width'>
                                    <ModalInner ref={this.myRef} >
                                        <Card.Body >
                                            <React.Fragment  >
                                            <Form ref={this.formRef}>
                                                        { this.props.loadSpec ?
                                                            <AddSpecification
                                                                AgaramTree={this.props.AgaramTree}
                                                                openNodes={this.props.openNodes}
                                                                handleTreeClick={this.props.onTreeClick}
                                                                focusKey={this.props.focusKey}
                                                                activeKey={this.props.activeKey}
                                                                Specification={this.props.Specification}
                                                                selectedSpec={this.props.selectedSpec}
                                                                selectedRecord={this.props.selectedRecord ? this.props.selectedRecord : ""}
                                                                onSpecChange={this.props.onspecChange}
                                                            />
                                                            :""  
                                                    }
                                                </Form>
                                            </React.Fragment>
                                        </Card.Body>
                                    </ModalInner>
                                </Modal.Body> 
                         </Modal> 
                         
                         :""}
                     </>
        )
    }
}
export default injectIntl(AddMaterialIqc);

