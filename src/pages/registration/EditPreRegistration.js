import React ,{useEffect} from 'react'
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import MultiColumnComboSearch from '../../components/multi-column-combo-search/multi-column-combo-search';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormTreeMenu from '../../components/form-tree-menu/form-tree-menu.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { TreeDesign } from './registration.styled';
import { RegistrationType, RegistrationSubType } from '../../components/Enumeration';
import PerfectScrollbar from 'react-perfect-scrollbar';

const EditPreRegistration = (props) => {

    const { productCategory, product, goodsIn, eProtocol, manufacturer, specification,
        storageCondition, storageLocation, client, realRegTypeValue, plasmaMasterFile,
        realRegSubTypeValue, productMaholder, agaramTree, openNodes, focusKey, activeKey } = props;

    // const disableControlStatus = [transactionStatus.PREREGISTER,
    // transactionStatus.REGISTER, transactionStatus.COMPLETED, transactionStatus.REVIEWED];
    const diableAllStatus = props.statustoEditDetail && props.statustoEditDetail.napprovalstatuscode;
    const recordStatus = props.selectedRecord && props.selectedRecord.ntransactionstatus;
    const myRef = React.createRef();
    const effectTime = 1000;
    useEffect(() => {
      let refEle = myRef && myRef.current && myRef.current;  
      setTimeout(()=>{
          if(refEle){
              refEle.getElementsByClassName("rstm-tree-item--active")[0].scrollIntoViewIfNeeded(false);
          }
      }  ,effectTime)
    } ,[]);
    return (<>
        <Row>
            <Col md={6}>
                <Col md={12}>
                    {(realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.PROTOCOL &&
                        realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL) &&

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_RMSNO" })}
                            isSearchable={true}
                            name={"nrmsno"}
                            isDisabled={diableAllStatus === recordStatus}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={goodsIn}
                            alphabeticalSort="true"
                            optionId="nrmsno"
                            optionValue="nrmsno"
                            value={props.selectedRecord ? props.selectedRecord["nrmsno"] : ""}
                            closeMenuOnSelect={true}
                            onChange={(event) => props.onComboChange(event, 'nrmsno')}>
                        </FormSelectSearch>

                    }

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_PRODUCTCATEGORY" })}
                        isSearchable={true}
                        name={"nproductcatcode"}
                        isDisabled={true}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={productCategory}
                        alphabeticalSort="true"
                        optionId="nproductcatcode"
                        optionValue="sproductcatname"
                        value={props.selectedRecord ? props.selectedRecord["nproductcatcode"] : ""}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'nproductcatcode')}>
                    </FormSelectSearch>

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_PRODUCT" })}
                        isSearchable={true}
                        name={"nproductcode"}
                        isDisabled={true}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        options={product}
                        alphabeticalSort="true"
                        optionId="nproductcode"
                        optionValue="sproductname"
                        value={props.selectedRecord ? props.selectedRecord["nproductcode"] : ""}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'nproductcode')}>
                    </FormSelectSearch>

                    {Object.keys(props.selectedRecord).length > 0 &&
                        <MultiColumnComboSearch data={manufacturer}
                            isDisabled={diableAllStatus === recordStatus}
                            visibility='show-all'
                            labelledBy="IDS_MANUFNAME"
                            fieldToShow={["smanufname", "smanufsitename", "seprotocolname"]}
                            selectedId={props.selectedRecord["nmanufcode"]}
                            value={props.selectedRecord ? [props.selectedRecord] : []}
                            isMandatory={true}
                            showInputkey="smanufname"
                            idslabelfield={["IDS_MANUFACTURERNAME", "IDS_SITENAME", "IDS_EPROTOCOL"]}
                            getValue={(value) => props.onMultiColumnValue(value, ["nproductmanufcode", "nmanufcode", "nmanufsitecode", "smanufname", "smanufsitename"], true, ["seprotocolname"], ["neprotocolcode"])}
                            singleSelection={true}
                        />
                    }
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_MANUFACTURERSITE" })}
                        name="smanufsitename"
                        type="text"
                        maxLength="100"
                        isMandatory={true}
                        value={props.selectedRecord["smanufsitename"] || []}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_MANUFACTURERSITE" })}
                        isDisabled={true}
                    />

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_EPROTOCOL" })}
                        isSearchable={true}
                        name={"neprotocolcode"}
                        isDisabled={diableAllStatus === recordStatus}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={false}
                        options={eProtocol}
                        // options={eProtocol ? constructOptionList(eProtocol || [], 'neprotocolcode',
                        //     'seprotocolname', undefined, undefined, undefined).get("OptionList") || [] : ""}
                        //alphabeticalSort="true"
                        //optionId="neprotocolcode"
                        //optionValue="seprotocolname"
                        value={props.selectedRecord ? props.selectedRecord["neprotocolcode"] : ""}
                        defaultValue={props.selectedRecord ? props.selectedRecord["neprotocolcode"] : ""}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'neprotocolcode')}>
                    </FormSelectSearch>

                    {realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.PROTOCOL
                        && realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL &&
                        <>
                            <FormSelectSearch
                                formLabel={props.formatMessage({ id: "IDS_STORAGECONDITION" })}
                                isSearchable={true}
                                isClearable={true}
                                name={"nstorageconditioncode"}
                                isDisabled={diableAllStatus === recordStatus}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={realRegSubTypeValue.nregsubtypecode === RegistrationSubType.EU ? true : realRegSubTypeValue.nregsubtypecode === RegistrationSubType.NON_EU ? true : false}
                                options={storageCondition}
                                //alphabeticalSort="true"
                                //optionId="nstorageconditioncode"
                                //optionValue="sstorageconditionname"
                                value={props.selectedRecord["nstorageconditioncode"]}
                                closeMenuOnSelect={true}
                                onChange={(event) => props.onComboChange(event, 'nstorageconditioncode')}>
                            </FormSelectSearch>


                            <FormSelectSearch
                                formLabel={props.formatMessage({ id: "IDS_STORAGELOCATION" })}
                                isSearchable={true}
                                isClearable={true}
                                name={"nstoragelocationcode"}
                                isDisabled={diableAllStatus === recordStatus}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={false}
                                options={storageLocation}
                                //alphabeticalSort="true"
                                //optionId="nstoragelocationcode"
                                //optionValue="sstoragelocationname"
                                value={props.selectedRecord["nstoragelocationcode"]}
                                closeMenuOnSelect={true}
                                onChange={(event) => props.onComboChange(event, 'nstoragelocationcode')}>
                            </FormSelectSearch>
                        </>
                    }
                    <FormInput
                        label={props.formatMessage({ id: "IDS_MANUFLOTNO" })}
                        name="smanuflotno"
                        type="text"
                        maxLength="100"
                        isMandatory={true}
                        isDisabled={diableAllStatus === recordStatus}
                        value={props.selectedRecord["smanuflotno"] || []}
                        onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.formatMessage({ id: "IDS_MANUFLOTNO" })}
                    />
                    {realRegTypeValue.nregtypecode === RegistrationType.NON_BATCH &&
                        <>
                            <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_CLIENTNAME" })}
                                isSearchable={true}
                                name={"nclientcode"}
                                isDisabled={diableAllStatus === recordStatus}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                options={client}
                                // alphabeticalSort="true"
                                // optionId="nclientcode"
                                // optionValue="sclientname"
                                value={props.selectedRecord["nclientcode"] || ""}
                                closeMenuOnSelect={true}
                                onChange={(event) => props.onClientComboChange(event)}
                                //onChange={(event) => props.onComboChange(event)}
                                >
                            </FormSelectSearch>

                            <FormInput
                                label={props.intl.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                                name="sclientsitename"
                                type="text"
                                maxLength="100"
                                value={props.selectedRecord["saddress1"] || []}
                                onChange={(event) => props.onInputOnChange(event)}
                                placeholder={props.intl.formatMessage({ id: "IDS_CLIENTSITENAME" })}
                                isDisabled={true}
                            />

                        </>
                    }
                    {realRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL &&
                        <>
                            {Object.keys(props.selectedRecord).length > 0 &&
                                <MultiColumnComboSearch data={productMaholder}
                                    visibility='show-all'
                                    labelledBy="IDS_MAHOLDERNAME"
                                    fieldToShow={["smahname", "slicencenumber", "sdosagepercontainer"]}
                                    selectedId={[props.selectedRecord["nproductmahcode"]]}
                                    value={props.selectedRecord ? [props.selectedRecord] : []}
                                    showInputkey="smahname"
                                    idslabelfield={["IDS_MAHNAME", "IDS_LICENSENUMBER", "IDS_DOSAGEPERCONTAINER"]}
                                    getValue={(value) => props.onMultiColumnMAHChange(value, ["nproductmahcode", "smahname"])}
                                    singleSelection={true}
                                    isDisabled={diableAllStatus === recordStatus}
                                />
                            }

                            {(realRegTypeValue.nregtypecode === RegistrationType.PLASMA_POOL
                                && realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL) &&
                                <>
                                    <Row>
                                        <Col md={6}>
                                            <DateTimePicker
                                                name={"dmanufdate"}
                                                label={props.intl.formatMessage({ id: "IDS_DATEOFMANUFWOTIME" })}
                                                className='form-control'
                                                placeholderText="Select date.."
                                                selected={props.selectedRecord["dmanufdate"]}
                                                dateFormat={props.userInfo["ssitedate"]}
                                                timeInputLabel={props.intl.formatMessage({ id: "IDS_DATEOFMANUF" })}
                                                showTimeInput={false}
                                                isClearable={false}
                                                isMandatory={false}
                                                required={true}
                                                onChange={date => props.handleDateChange("dmanufdate", date)}
                                                value={props.selectedRecord["dmanufdate"]}
                                                isDisabled={diableAllStatus === recordStatus}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FormSelectSearch
                                                name={"ntzdmanufdate"}
                                                formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                // options={props.timeZoneList ? constructOptionList(props.timeZoneList || [], 'ntimezonecode',
                                                //     'stimezoneid', undefined, undefined, undefined).get("OptionList") || [] : ""}
                                                options={props.timeZoneList}
                                                optionId="ntimezonecode"
                                                optionValue="stimezoneid"
                                                value={props.selectedRecord["ntzdmanufdate"]}
                                                isMandatory={false}
                                                isSearchable={true}
                                                isClearable={false}
                                                closeMenuOnSelect={true}
                                                alphabeticalSort={true}
                                                onChange={(value) => props.onComboChange(value, 'ntzdmanufdate')}
                                                isDisabled={diableAllStatus === recordStatus}
                                            />
                                        </Col>
                                    </Row>

                                    <FormInput
                                        label={props.formatMessage({ id: "IDS_NOOFDONATIONS" })}
                                        name="nnoofdonations"
                                        type="text"
                                        maxLength="100"
                                        isMandatory={false}
                                        value={props.selectedRecord["nnoofdonations"] || []}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        placeholder={props.formatMessage({ id: "IDS_NOOFDONATIONS" })}
                                        isDisabled={diableAllStatus === recordStatus}
                                    />

                                    <FormInput
                                        label={props.formatMessage({ id: "IDS_POOLBULKVOLUME" })}
                                        name="sbulkvolume"
                                        type="text"
                                        maxLength="100"
                                        isMandatory={true}
                                        value={props.selectedRecord["sbulkvolume"] || []}
                                        onChange={(event) => props.onInputOnChange(event)}
                                        placeholder={props.formatMessage({ id: "IDS_POOLBULKVOLUME" })}
                                        isDisabled={diableAllStatus === recordStatus}
                                    />

                                    <FormSelectSearch
                                        formLabel={props.formatMessage({ id: "IDS_PLASMAMASTERFILE" })}
                                        isSearchable={true}
                                        name={"nplasmafilecode"}
                                        isDisabled={diableAllStatus === recordStatus}
                                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                        isMandatory={false}
                                        options={plasmaMasterFile}
                                        alphabeticalSort="true"
                                        optionId="nplasmafilecode"
                                        optionValue="splasmafilenumber"
                                        value={props.selectedRecord["nplasmafilecode"] || ""}
                                        closeMenuOnSelect={true}
                                        onChange={(event) => props.onComboChange(event, 'nplasmafilecode')}>
                                    </FormSelectSearch>

                                </>
                            }
                        </>
                    }
                </Col>
            </Col>
            <Col md={6}>
                <Row>
                    <Col md={12} >
                        <TreeDesign operation={props.operation} ref={myRef} className="mb-4">

                            {agaramTree && agaramTree.length > 0 &&
                                <PerfectScrollbar>
                                    <FormTreeMenu
                                        data={agaramTree}
                                        handleTreeClick={props.onTreeClick}
                                        hasSearch={false}
                                        initialOpenNodes={openNodes}
                                        focusKey={focusKey || ""}
                                        activeKey={activeKey || ""}
                                    />
                                </PerfectScrollbar>
                            }

                        </TreeDesign>


                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_TESTGROUP" })}
                            isSearchable={true}
                            name={"nallottedspeccode"}
                            isDisabled={true}
                            placeholder={props.intl.formatMessage({ id: "IDS_TESTGROUP" })}
                            isMandatory={true}
                            options={specification}
                            alphabeticalSort="true"
                            optionId="nallottedspeccode"
                            optionValue="sspecname"
                            value={props.selectedRecord ? props.selectedRecord["nallottedspeccode"] : ""}
                            defaultValue={props.selectedRecord ? props.selectedRecord["nallottedspeccode"] : ""}
                            closeMenuOnSelect={true}
                            onChange={(event) => props.onspecChange(event, ['nallottedspeccode', 'sversionno'])}>
                        </FormSelectSearch>

                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_VERSION" })}
                            name="sversion"
                            type="text"
                            maxLength="100"
                            value={props.selectedRecord["sversion"] || []}
                            placeholder={props.intl.formatMessage({ id: "IDS_VERSION" })}
                            isDisabled={true}
                        />

                        {realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.PROTOCOL
                            && realRegSubTypeValue.nregsubtypecode !== RegistrationSubType.EXTERNAL_POOL &&
                            <FormNumericInput
                                name="nnoofcontainer"
                                label={props.formatMessage({ id: "IDS_NOOFCONTAINER" })}
                                placeholder={props.formatMessage({ id: "IDS_NOOFCONTAINER" })}
                                type="number"
                                value={props.selectedRecord["nnoofcontainer"]}
                                //max={99}
                                min={0}
                                strict={true}
                                maxLength={8}
                                onChange={(event) => props.onNumericInputChange(event, "nnoofcontainer")}
                                noStyle={true}
                                precision={0}
                                className="form-control"
                                isMandatory={true}
                                errors="Please provide a valid number."
                                isDisabled={diableAllStatus === recordStatus}
                            />
                        }
                        <Row>
                            <Col md={6}>
                                <DateTimePicker
                                    name={"dreceiveddate"}
                                    label={props.intl.formatMessage({ id: "IDS_RECEIVEDDATEWOTIME" })}
                                    className='form-control'
                                    placeholderText="Select date.."
                                    selected={props.selectedRecord["dreceiveddate"]}
                                    dateFormat={props.userInfo["ssitedate"]}
                                    timeInputLabel={props.intl.formatMessage({ id: "IDS_RECEIVEDDATE" })}
                                    showTimeInput={false}
                                    isClearable={false}
                                    isMandatory={true}
                                    required={true}
                                    maxDate={props.CurrentTime}
                                    maxTime={props.CurrentTime}
                                    onChange={date => props.handleDateChange("dreceiveddate", date)}
                                    value={props.selectedRecord["dreceiveddate"]}
                                    isDisabled={diableAllStatus === recordStatus}

                                />
                            </Col>
                            <Col md={6}>
                                <FormSelectSearch
                                    name={"ntzdreceivedate"}
                                    formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                    options={props.timeZoneList}
                                    // options={props.timeZoneList ? constructOptionList(props.timeZoneList || [], 'ntimezonecode',
                                    //     'stimezoneid', undefined, undefined, undefined).get("OptionList") || [] : ""}
                                    optionId="ntimezonecode"
                                    optionValue="stimezoneid"
                                    value={props.selectedRecord["ntzdreceivedate"]}
                                    isMandatory={true}
                                    isSearchable={true}
                                    isClearable={false}
                                    closeMenuOnSelect={true}
                                    alphabeticalSort={true}
                                    onChange={(value) => props.onComboChange(value, 'ntzdreceivedate')}
                                    isDisabled={diableAllStatus === recordStatus}
                                />
                            </Col>
                        </Row>
                        <FormTextarea
                            label={props.formatMessage({ id: "IDS_COMMENTS" })}
                            name="scomments"
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.formatMessage({ id: "IDS_COMMENTS" })}
                            value={props.selectedRecord["scomments"] === 'null' ? '' : props.selectedRecord["scomments"]}
                            isMandatory={false}
                            required={false}
                            maxLength={255}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
    )
}

export default injectIntl(EditPreRegistration);