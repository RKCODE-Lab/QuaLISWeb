import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import DropZone from '../../components/dropzone/dropzone.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';



const ProjectMasterClosure = (props) => {
    return (
        <Row>
            <Col md={12}>

                <Row>

                    <Col md={12}>
                        <FormGroup>
                            {/* <FormLabel><FormattedMessage id="IDS_FILENAME" message="File Name" /></FormLabel> */}
                            {/* {props.FileImagePath === null ? "-" :
                                <a href={props.fileImgPath} download>
                                    <Image src={props.fileImgPath}
                                        width={100} height={75}
                                        rounded
                                        //onClick={() => window.open(signImgPath, '_blank')}
                                        //onClick={()=>this.downloadImage(this.props.Login.masterData.SignImagePath)}
                                        title={props.sfileimgname} />
                                </a>
                            } */}
                            <DropZone
                                name={props.name}
                                label={props.label}
                                isMandatory={false}
                                maxFiles={props.maxFiles}
                                minSize={0}
                                maxSize={props.maxSize}
                                onDrop={(event) => props.onDrop(event, "sfilename", props.maxFiles)}
                                actionType={props.actionType}
                                deleteAttachment={props.deleteAttachment}
                                multiple={props.multiple}
                                editFiles={props.selectedRecord ? props.selectedRecord : {}}
                                attachmentTypeCode={0}
                                fileSizeName="nfilesize"
                                fileName="sfilename"

                            />
                        </FormGroup>
                    </Col>

                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
            <DateTimePicker
                            name={"dprojectclosuredate"}
                            label={props.intl.formatMessage({ id: "IDS_CLOSUREDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dprojectclosuredate"] ?props.selectedRecord["dprojectclosuredate"] :new Date()}
                            //    dateFormat={props.userInfo.ssitedate}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            value={props.selectedRecord["dprojectclosuredate"]? props.selectedRecord["dprojectclosuredate"] : new Date()}
                            maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dprojectclosuredate", date)}/>
            </Col>


            {props.userInfo.istimezoneshow  === transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzprojectclosuredate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntzprojectclosuredate"]}
                        defaultValue={props.selectedRecord["ntzprojectclosuredate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzprojectclosuredate', 1)}
                    />

                </Col>
            }  

                    <Col md={12}>
                        <FormTextarea
                            name={"sclosureremarks"}
                            label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            value={props.selectedRecord ? props.selectedRecord["sclosureremarks"] : ""}
                            rows="2"
                            required={false}
                            maxLength={500}
                            isMandatory={false}
                        >
                        </FormTextarea>
                    </Col>

                </Row>
            </Col>


        </Row>

    );
}




export default injectIntl(ProjectMasterClosure);