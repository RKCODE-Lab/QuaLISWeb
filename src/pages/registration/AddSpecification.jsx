import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import PerfectScrollbar from 'react-perfect-scrollbar';
import FormInput from '../../components/form-input/form-input.component';
import { TreeDesign } from './registration.styled';
import FormTreeMenu from '../../components/form-tree-menu/form-tree-menu.component';

const AddSpecification = (props) => {
    if(props && props.AgaramTree && props.AgaramTree.length > 0){
        props.AgaramTree[0]["label"] = props.AgaramTree[0]["label"] === 'root' ? 
        props.intl.formatMessage({ id: "IDS_ROOT" }) : props.AgaramTree[0]["label"];
   } 
    return (
        <Row>
            {/* <Col md={12}> */}

                <Col md={6} className="r_treepadding" >
                    <TreeDesign>
                        <PerfectScrollbar>
                            <FormTreeMenu
                                data={props.AgaramTree}
                                handleTreeClick={props.handleTreeClick}
                                // openNodes={props.OpenNodes}
                                //hasSearch={true}
                                initialOpenNodes={props.openNodes}
                                // initialFocusKey={InitialFocusKey}
                                // initialActiveKey={InitialActiveKey}
                                focusKey={props.focusKey || ""}
                                activeKey={props.activeKey || ""}
                            />
                        </PerfectScrollbar>

                    </TreeDesign>
                </Col>
                <Col md={6}>
                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id:"IDS_SPECIFICATION"})}
                            isSearchable={true}
                            name={"nallottedspeccode"}
                            isDisabled={true}
                            placeholder={props.intl.formatMessage({ id:"IDS_SPECIFICATION"})}
                            isMandatory={true}
                            options={props.Specification || []}
                            alphabeticalSort="true"
                            optionId="nallottedspeccode"
                            optionValue="sspecname"
                            value={props.selectedRecord['nallottedspeccode'] ? props.selectedRecord['nallottedspeccode'] : ""}
                            defaultValue={props.selectedRecord['nallottedspeccode'] ? props.selectedRecord['nallottedspeccode'] : ""}
                            //  showOption={true}
                            closeMenuOnSelect={true}
                            onChange={(event) => props.onSpecChange(event, ['nallottedspeccode', 'sversionno'])}>
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id:"IDS_VERSION"})}
                            name="sversion"
                            type="text"
                            maxLength="100"
                            value={props.selectedRecord['sversion'] ? props.selectedRecord['sversion'] : ""}
                            placeholder={props.intl.formatMessage({ id:"IDS_VERSION"})}
                            isDisabled={true}
                        />
                    </Col>
                </Col>

            {/* </Col> */}
        </Row>
    )
}
export default injectIntl(AddSpecification);