import React from 'react';
import { injectIntl } from 'react-intl';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { ReadOnlyText } from '../../components/App.styles';

const TestGroupMaterialAccordion = (props) => {

    const materialFieldName = [{ "smaterialtypename": "IDS_MATERIALTYPE" },
    { "smaterialcatname": "IDS_MATERIALCATEGORY" },
    { "smaterialname": "IDS_MATERIAL" },
    { "sremarks": "IDS_REMARKS" }
    ];


    const editMaterialId = props.controlMap && props.controlMap.has("EditTestMaterial") && props.controlMap.get("EditTestMaterial").ncontrolcode;
    const deleteMaterialId = props.controlMap && props.controlMap.has("DeleteTestMaterial") && props.controlMap.get("DeleteTestMaterial").ncontrolcode;

    const { selectedMaterial, userInfo, userRoleControlRights } = props;
    return (
        <>
            <Row>
                <Col md={12} className="d-flex justify-content-end">
                    <Nav.Link className="btn btn-circle outline-grey mr-2"
                        hidden={userRoleControlRights.indexOf(editMaterialId) === -1}
                        data-tip={props.intl.formatMessage({ id: "IDS_EDIT" })}
                        onClick={() => props.getDataForEditTestMaterial("IDS_TESTGROUPMATERIAL", "update", props.userInfo, editMaterialId, props.selectedRecord, props.masterData, "ntestgrouptestmaterialcode")}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Nav.Link>
                    <Nav.Link className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                        data-tip={props.intl.formatMessage({ id: "IDS_DELETE" })}
                        hidden={props.userRoleControlRights.indexOf(deleteMaterialId) === -1}
                        onClick={() => props.ConfirmDelete({ operation: 'delete', screenName: 'IDS_TESTGROUPMATERIAL' }, deleteMaterialId, props.selectedRecord)}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />

                    </Nav.Link>
                </Col>
            </Row>


            <Row>

                {materialFieldName.map(item => {
                    return (
                        <Col md="12">
                            <FormGroup>
                                <FormLabel>{props.intl.formatMessage({ id: Object.values(item)[0] })}</FormLabel>
                                <ReadOnlyText>{selectedMaterial[Object.keys(item)[0]]===""?'-':selectedMaterial[Object.keys(item)[0]]}</ReadOnlyText>
                            </FormGroup>
                        </Col>


                    )
                }
                )}
            </Row>



        </>
    );
};

export default injectIntl(TestGroupMaterialAccordion);
