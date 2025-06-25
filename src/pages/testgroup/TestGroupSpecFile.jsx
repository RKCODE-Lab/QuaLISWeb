import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ListAttachment from '../../components/ListAttachment';
import { toast } from 'react-toastify';
import { designProperties } from '../../components/Enumeration';
// import ReactTooltip from 'react-tooltip';

const TestGroupSpecFile = (props) => {
    const addSpecId = props.controlMap.has("AddSpecFile") && props.controlMap.get("AddSpecFile").ncontrolcode;
    const editSpecId = props.controlMap.has("EditSpecFile") && props.controlMap.get("EditSpecFile").ncontrolcode;
    const deleteSpecId = props.controlMap.has("DeleteSpecFile") && props.controlMap.get("DeleteSpecFile").ncontrolcode;
    const viewSpecId = props.controlMap.has("ViewSpecFile") && props.controlMap.get("ViewSpecFile").ncontrolcode;
    const editParam = {
        screenName: "IDS_SPECFILE", inputParam: props.inputParam,
        testgroupspecification: props.selectedSpecification, userInfo: props.userInfo, 
        ncontrolCode: editSpecId, modalName: "openModal",filterData:props.filterData,
        masterData:props.masterData
    };
    const subFields = [//{ [designProperties.VALUE]: "slinkname" }, 
  //  { [designProperties.VALUE]: "screateddate" },
    //{ [designProperties.VALUE]: "sfilesize", "fieldType": "size" }
   ];
    //const moreField = [{ [designProperties.VALUE]: "sdescription" }];
    const moreField=[ { [designProperties.LABEL]: "IDS_LINK", [designProperties.VALUE]: "slinkname" },
    { [designProperties.LABEL]: "IDS_CREATEDDATE", [designProperties.VALUE]: "screateddate" },
    { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" },]
    function viewFile(file) {
        const viewParam = {
            inputData: {
                userinfo: props.userInfo,
                testgroupspecfile: file,
                testgroupspecification: props.selectedSpecification
            },
            classUrl: "testgroup",
            operation: "view",
            methodUrl: "TestGroupSpecFile"
        }
        props.viewAttachment(viewParam);
    }

    return (
        <>
            <div className="actions-stripe border-bottom">
                <div className="d-flex justify-content-end">
                    {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                    <Nav.Link name="addtestfile" className="add-txt-btn" hidden={props.userRoleControlRights.indexOf(addSpecId) === -1}
                        // data-tip={props.intl.formatMessage({ id: "IDS_ADD" })}
                        // data-for="tooltip-list-wrap"
                        onClick={(event) => props.selectedSpecification ?
                            props.addTestFile({ userInfo: props.userInfo, operation: "create", ncontrolCode: addSpecId, screenName: "IDS_SPECFILE", modalName: "openModal",nflag:1 })
                            : toast.warn(props.intl.formatMessage({ id: "IDS_SPECIFICATIONNOTAVAILABLE" }))}>
                        <FontAwesomeIcon icon={faPlus} /> { }
                        <FormattedMessage id="IDS_ADDFILE" defaultMessage="Add File" />
                    </Nav.Link>
                </div>
            </div>
            {/* {props.testGroupSpecFile && props.testGroupSpecFile.length > 0 && */}
                <ListAttachment
                    attachmentList={props.testGroupSpecFile}
                    fileName="sfilename"
                    filesize="nfilesize"
                    linkname="slinkname"
                    deleteRecord={props.deleteRecord}
                    deleteParam={{ operation: "delete", methodUrl: "SpecificationFile", keyName: "testgroupspecfile", screenName: "IDS_FILE" ,filterData:props.filterData}}
                    editParam={editParam}
                    fetchRecord={props.editSpecFile}
                    deleteId={deleteSpecId}
                    editId={editSpecId}
                    viewId={viewSpecId}
                    userRoleControlRights={props.userRoleControlRights}
                    viewFile={viewFile}
                    subFields={subFields}
                    moreField={moreField}
                    settings = {props.settings}
                    userInfo={props.userInfo}
                />
                {/* } */}
        </>
    );
};

export default injectIntl(TestGroupSpecFile);