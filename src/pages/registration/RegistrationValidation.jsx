
import { intl } from '../../components/App';
import { convertDateTimetoStringDBFormat, formatInputDate, Lims_JSON_stringify, create_UUID } from '../../components/CommonScript';
import { SampleType, orderType, transactionStatus } from '../../components/Enumeration';
export function fnCheckBatchComponentMandatory(Components) {
    // Components.map(component => {
    for (var i = 0; i < Components.length; i++) {
        if ((
            Components[i].smanuflotno).length <= 0) {
            // alert('IDS_ENTERMANUFLOTNOFOR ' + Components[i].scomponentname);
            return (intl.formatMessage({ id: "IDS_ENTERMANUFLOTNOFOR" }) + Components[i].scomponentname);

        } else if (Components[i].nnoofcontainer && (Components[i].nnoofcontainer).length <= 0) {
            // alert('IDS_ENTERNOOFCONTFOR' + Components[i].scomponentname);
            return (intl.formatMessage({ id: "IDS_ENTERNOOFCONTFOR" }) + Components[i].scomponentname);
            // return ('IDS_ENTERNOOFCONTFOR' + Components[i].scomponentname);
        } else if (Components[i].dreceiveddate === null) {
            // alert('IDS_ENTERMANUFLOTNOFOR' + Components[i].scomponentname);
            return (intl.formatMessage({ id: "IDS_ENTERMANUFLOTNOFOR" }) + Components[i].scomponentname);
            // return ('IDS_ENTERMANUFLOTNOFOR' + Components[i].scomponentname);
        }
    }
    return true;
}
export function fnCheckBatchProtocolComponentMandatory(Components) {
    //Components.map(component => {
    for (var i = 0; i < Components.length; i++) {
        if ((Components[i].smanuflotno).length <= 0) {
            // alert('IDS_ENTERMANUFLOTNOFOR ' + {} + component.scomponentname);
            //return (intl.formatMessage({ id: 'IDS_ENTERMANUFLOTNOFOR ' }) + {} + Components[i].scomponentname);
            return (intl.formatMessage({ id: "IDS_ENTERMANUFLOTNOFOR" }) + Components[i].scomponentname);
        } else if (Components[i].dreceiveddate === null) {
            // alert('IDS_ENTERMANUFLOTNOFOR' + component.scomponentname);
            return (intl.formatMessage({ id: "IDS_ENTERMANUFLOTNOFOR" }) + Components[i].scomponentname);
        }
        //return null;
        //});
    }
    return true;
}

export function checkDuplicateComponentandManufLot(Components) {
    let copiedArrays = [...Components];
    let DuplicateComponent = [];
    let bReturnFlag = true;
    Components.map(component => {
        copiedArrays.forEach(componentArray => {
            (component.slno !== componentArray.slno && component.smanuflotno === componentArray.smanuflotno &&
                component.scomponentname === componentArray.scomponentname) && DuplicateComponent.push(component);
        })
        return null;
    });
    if (DuplicateComponent.length > 0) {
        let smanuflotno = DuplicateComponent[0].smanuflotno;
        let scomponentname = DuplicateComponent[0].scomponentname;
        // Alert.show(resourceManager.getString('LocalizedStrings', 'IDS_DUPLICATEMANFNO') + " " + smanuflotno + " for " + scomponentname, resourceManager.getString('LocalizedStrings', 'IDS_WARNING'));
        bReturnFlag = intl.formatMessage({ id: 'IDS_DUPLICATEMANFNO' }) + " " + smanuflotno + " " + intl.formatMessage({ id: 'IDS_FOR' }) + " " + scomponentname;
    }
    return bReturnFlag;
}
export function TestListManipulation(Components, Test) {
    //console.log("Test in component");
    let ArrayList = [];
    Components.map(component => {
        return ArrayList = Test && Test[component.slno] ? [...ArrayList, ...Test[component.slno]] : ArrayList;
    });

    //    ArrayList.map(item=>{
    //        item['jsondata']={}
    //       // if(item==='nsectioncode'||item==='nmethodcode'){
    //         item['jsondata']['nsectioncode']={value:item['nsectioncode'],label:item['ssectionname']}
    //         item['jsondata']['nmethodcode']={value:item['nmethodcode'],label:item['smethodname']}
    //         item['jsondata']['ninstrumentcatcode']={value:item['ninstrumentcatcode'],label:item['sinstrumentcatname']}
    //         item['jsondata']['ntestcode']=item['ntestcode']
    //         item['jsondata']['ncost']=item['ncost']
    //       // }
    //    })
    return ArrayList ? ArrayList : [];
}

export function SubSample(Components, specBasedComponent, nneedsubsample, selectedSpec) {
    //  let ArrayList = [];
    if (nneedsubsample) {
        if (specBasedComponent) {
            Components.map(component => {
                // if(component==="ncomponentcode"){
                return component["ncomponentcode"]
                // }
            });
            return Components;
        } else {
            Components.map(component => {
                // if(component==="ncomponentcode"){
                return component["ncomponentcode"] = -1;
                // }
            });
            return Components;
        }
    } else {
        Components.map(component => {
            // if(component==="ncomponentcode"){
            component["ncomponentcode"] = -1
            component["nspecsampletypecode"] = selectedSpec.nallottedspeccode.item.nspecsampletypecode
            return component;
            // }
        });
        return Components;
    }
}

export function getRegistration(masterData, selectedRecord, selectedSpec,
    templateList, userInfo, defaulttimezone, operation, comboComponents) {
    let sampleRegistration = {};
    let dateList = []
    sampleRegistration["nsampletypecode"] = masterData.RealSampleTypeValue.nsampletypecode;
    sampleRegistration["nregtypecode"] = masterData.RealRegTypeValue && masterData.RealRegTypeValue.nregtypecode||-1;
    sampleRegistration["nregsubtypecode"] = masterData.RealRegTypeValue && masterData.RealRegSubTypeValue.nregsubtypecode||-1;
    sampleRegistration["ndesigntemplatemappingcode"] =masterData.RealDesignTemplateMappingValue && masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode||-1;
    sampleRegistration["nregsubtypeversioncode"] =masterData.RealRegTypeValue && masterData.RealRegSubTypeValue.nregsubtypeversioncode||-1;
    sampleRegistration["ntemplatemanipulationcode"] = operation === 'update' ? masterData.selectedSample[0].ntemplatemanipulationcode : selectedSpec.ntemplatemanipulationcode;
    sampleRegistration["nallottedspeccode"] = operation === 'update' ? masterData.selectedSample[0].nallottedspeccode : selectedSpec.nallottedspeccode.value;


    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.PRODUCT) {

        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    } else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.INSTRUMENT) {
        sampleRegistration["ninstrumentcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']].value : -1;
        sampleRegistration["ninstrumentcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.MATERIAL) {
        sampleRegistration["nmaterialcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']].value : -1;
        sampleRegistration["nmaterialcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')] && comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] !== undefined ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ngendercode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Gender')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Gender')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE) {
        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')] && comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] !== undefined ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["nprojectmastercode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Project Code')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Project Code')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.STABILITY) {
        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
        const protocolLabelName = comboComponents.filter(x => x.name === "protocol id");
        sampleRegistration["nprotocolcode"]  = selectedRecord[protocolLabelName[0].label] &&
        selectedRecord[protocolLabelName[0].label].value||-1;
    }

    sampleRegistration["jsondata"] = {}
    sampleRegistration["jsonuidata"] = {}

    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
        sampleRegistration["jsondata"]['spatientid'] = selectedRecord['spatientid'] ? selectedRecord['spatientid'] : ''
        sampleRegistration["jsonuidata"]['spatientid'] = selectedRecord['spatientid'] ? selectedRecord['spatientid'] : ''
        sampleRegistration["jsondata"]['nexternalordertypecode'] = selectedRecord.Order && selectedRecord.Order.item && selectedRecord.Order.item.jsondata.nexternalordertypecode ? selectedRecord.Order.item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:-1
        sampleRegistration["jsonuidata"]['nexternalordertypecode'] = selectedRecord.Order && selectedRecord.Order.item && selectedRecord.Order.item.jsondata.nexternalordertypecode ? selectedRecord.Order.item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:-1
        sampleRegistration["jsondata"]["orderTypeValue"] = selectedRecord['Order Type'] && selectedRecord['Order Type'].value
        sampleRegistration["jsonuidata"]["orderTypeValue"] = selectedRecord['Order Type'] && selectedRecord['Order Type'].value
    }
    
    //console.log("save registration:", selectedRecord);
    templateList && templateList.map(row => {
        return row.children.map(column => {
            return column.children.map(component => {
                if (component.hasOwnProperty("children")) {
                    return component.children.map(componentrow => {
                        if (componentrow.inputtype === "combo" || componentrow.inputtype === "predefineddropdown") {
                            //  if(componentrow.recordbasedreadonly)
                            if (componentrow.inputtype === "predefineddropdown") {
                                sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    {
                                        value: selectedRecord[componentrow.label].value,
                                        label: selectedRecord[componentrow.label].label
                                        // pkey: componentrow.valuemember,
                                        // nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                        // source: componentrow.source,
                                        // [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]:  operation === "update"?
                                        // selectedRecord[componentrow.label].item? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                        // selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        //     :
                                        //     selectedRecord[componentrow.label].item? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: 
                                        //     selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]?  selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        //     :  selectedRecord[componentrow.label].vale

                                    } : -1
                                sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";

                            } else {
                                sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    {
                                        value: selectedRecord[componentrow.label].value,
                                        label: selectedRecord[componentrow.label].label,
                                        pkey: componentrow.valuemember,
                                        nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                        source: componentrow.source,
                                        [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: operation === "update" ?
                                            selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                            :
                                            selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] ? selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                    : selectedRecord[componentrow.label].value

                                    } : -1
                                sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";

                            }
                            //  sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";
                            if (componentrow.name === 'manualorderid') {
                                sampleRegistration["jsondata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'] ?
                                    sampleRegistration["jsondata"]['spatientid'] : selectedRecord[componentrow.label].item ?
                                        selectedRecord[componentrow.label].item['jsondata']['spatientid'] : "";

                                sampleRegistration["jsonuidata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'];
                                if (operation === 'update') {
                                    sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord["Patient Permanent Address"] ? selectedRecord["Patient Permanent Address"] : "";

                                    sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address'];


                                    sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord["Patient Current Address"] ? selectedRecord["Patient Current Address"] : "";

                                    sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address'];

                                    sampleRegistration["jsondata"]['External Id'] = selectedRecord["External Id"] ? selectedRecord["External Id"] : "";

                                    sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];

                                    sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord["Patient Passport No"] ? selectedRecord["Patient Passport No"] : "";
                                    sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No'];

                                    sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord["Patient Phone No"] ? selectedRecord["Patient Phone No"] : "";
                                    sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No'];

                                    sampleRegistration["jsondata"]['Institution Code'] = selectedRecord["Institution Code'"] ? selectedRecord["Institution Code'"] : "";
                                    sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code'];

                                    sampleRegistration["jsondata"]['District/City'] = selectedRecord["District/City"] ? selectedRecord["District/City"] : "";
                                    sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];

                                    sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord["Submitter Phone No"] ? selectedRecord["Submitter Phone No"] : "";
                                    sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No'];

                                }
                                else {

                                    sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['spermanentadd'] : ""

                                    sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address'];

                                    sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['scurrentadd'] : "";

                                    sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address'];

                                    sampleRegistration["jsondata"]['External Id'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sexternalid'] : "";

                                    sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];


                                    sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['spassportno'] : "";

                                    sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No'];

                                    sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sphoneno'] : "";

                                    sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No'];

                                    sampleRegistration["jsondata"]['Institution Code'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sinstitutioncode'] : "";

                                    sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code'];

                                    sampleRegistration["jsondata"]['District/City'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sinsdistrictcity'] : "";

                                    sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];

                                    sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['submittertelephone'] : "";

                                    sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No'];

                                }
                            }


                        }
                        else if (componentrow.inputtype === "date") {
                            if (componentrow.mandatory) {
                                sampleRegistration["jsondata"][componentrow.label] = (typeof selectedRecord[componentrow.label] === "object") ?
                                    convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[componentrow.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)
                                        : selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            } else {
                                sampleRegistration["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                    typeof selectedRecord[componentrow.label] === "object" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : new Date(), userInfo) :
                                        typeof selectedRecord[componentrow.label] === "number" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "" :
                                    selectedRecord[componentrow.label] ? typeof selectedRecord[componentrow.label] === "object" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : new Date(), userInfo) : typeof selectedRecord[componentrow.label] === "number" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label]
                                                : "" : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            }
                            if (componentrow.timezone) {
                                sampleRegistration["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                    { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                    defaulttimezone ? defaulttimezone : -1

                                sampleRegistration["jsonuidata"][`tz${componentrow.label}`] = sampleRegistration["jsondata"][`tz${componentrow.label}`]
                            }
                            dateList.push(componentrow.label)
                        }

                        else {
                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                selectedRecord[componentrow.label] : ""

                            sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                        }
                    })
                    return sampleRegistration;

                }
                else {
                    if (component.inputtype === "combo" || component.inputtype === "predefineddropdown") {
                        if (component.inputtype === "predefineddropdown") {
                            sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                                {
                                    value: selectedRecord[component.label].value,
                                    label: selectedRecord[component.label].label,
                                    // pkey: component.valuemember,
                                    // nquerybuildertablecode: component.nquerybuildertablecode,
                                    // source: component.source,
                                    // [component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]:  operation === "update"?
                                    // selectedRecord[component.label].item? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                    //     selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    //         :
                                    //         selectedRecord[component.label].item? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: 
                                    //         selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]?  selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    //         :  selectedRecord[component.label].vale

                                } : -1
                            sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";

                        } else {
                            sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                                {
                                    value: selectedRecord[component.label].value,
                                    label: selectedRecord[component.label].label,
                                    pkey: component.valuemember,
                                    nquerybuildertablecode: component.nquerybuildertablecode,
                                    source: component.source,
                                    [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: operation === "update" ?
                                        selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                            selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                        :
                                        selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                            selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] ? selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                : selectedRecord[component.label].value

                                } : -1
                            sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";

                        }
                        if (component.name === 'manualorderid') {
                            sampleRegistration["jsondata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'] ?
                                sampleRegistration["jsondata"]['spatientid'] : selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['spatientid'] : "";

                            sampleRegistration["jsonuidata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'];

                            if (operation === 'update') {
                                sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord["Patient Permanent Address"] ? selectedRecord["Patient Permanent Address"] : "";

                                sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address'];


                                sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord["Patient Current Address"] ? selectedRecord["Patient Current Address"] : "";

                                sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address'];

                                sampleRegistration["jsondata"]['External Id'] = selectedRecord["External Id"] ? selectedRecord["External Id"] : "";

                                sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];

                                sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord["Patient Passport No"] ? selectedRecord["Patient Passport No"] : "";
                                sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No'];

                                sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord["Patient Phone No"] ? selectedRecord["Patient Phone No"] : "";
                                sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No'];

                                sampleRegistration["jsondata"]['Institution Code'] = selectedRecord["Institution Code'"] ? selectedRecord["Institution Code'"] : "";
                                sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code'];

                                sampleRegistration["jsondata"]['District/City'] = selectedRecord["District/City"] ? selectedRecord["District/City"] : "";
                                sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];

                                sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord["Submitter Phone No"] ? selectedRecord["Submitter Phone No"] : "";
                                sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No'];

                            }
                            else {

                                sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['spermanentadd'] : ""

                                sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address']


                                sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['scurrentadd'] : ""

                                sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address']


                                sampleRegistration["jsondata"]['External Id'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sexternalid'] : "";

                                sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];

                                sampleRegistration["jsondata"]['OrderIdData'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sexternalorderid'] : "";

                                sampleRegistration["jsonuidata"]['OrderIdData'] = sampleRegistration["jsondata"]['OrderIdData'];


                                sampleRegistration["jsondata"]['OrderCodeData'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['nexternalordercode'] : "";

                                sampleRegistration["jsonuidata"]['OrderCodeData'] = sampleRegistration["jsondata"]['OrderCodeData'];


                                sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['spassportno'] : ""

                                sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No']


                                sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sphoneno'] : ""

                                sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No']


                                sampleRegistration["jsondata"]['Institution Code'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sinstitutioncode'] : ""

                                sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code']

                                sampleRegistration["jsondata"]['District/City'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sinsdistrictcity'] : ""

                                sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];


                                sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['submittertelephone'] : ""

                                sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No']

                            }
                        }
                    }
                    else if (component.inputtype === "date") {
                        if (component.mandatory) {
                            console.log(typeof selectedRecord[component.label] === "object")
                            sampleRegistration["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?

                                convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) :
                                (typeof selectedRecord[component.label] === "number") ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        new Date(selectedRecord[component.label]) : new Date(), userInfo) :
                                    selectedRecord[component.label] ?
                                        selectedRecord[component.label] : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        } else {
                            sampleRegistration["jsondata"][component.label] = component.loadcurrentdate ?
                                typeof selectedRecord[component.label] === "object" ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        selectedRecord[component.label] : new Date(), userInfo) :
                                    typeof selectedRecord[component.label] === "number" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo)

                                        : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" :
                                selectedRecord[component.label] ? typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) : typeof selectedRecord[component.label] === "number" ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        new Date(selectedRecord[component.label]) : new Date(), userInfo)
                                    : selectedRecord[component.label] ?
                                        selectedRecord[component.label] : "" : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        }
                        if (component.timezone) {
                            sampleRegistration["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                defaulttimezone ? defaulttimezone : -1

                            sampleRegistration["jsonuidata"][`tz${component.label}`] = sampleRegistration["jsondata"][`tz${component.label}`]
                        }
                        dateList.push(component.label)
                    }
                    else {
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            selectedRecord[component.label] : ""

                        sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                    }
                    return sampleRegistration;
                }
            }
            )
        })
    })

    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.PRODUCT && selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata) {
        sampleRegistration["jsondata"]['nexternalordertypecode'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode ? selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:''
        sampleRegistration["jsonuidata"]['nexternalordertypecode'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode ? selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:''
        sampleRegistration["jsondata"]['sexternalordertypename'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.sexternalordertypename ? selectedRecord['Plant Order'].item.jsondata.sexternalordertypename : selectedRecord&&selectedRecord.sexternalordertypename?selectedRecord.sexternalordertypename:''
        sampleRegistration["jsonuidata"]['sexternalordertypename'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.sexternalordertypename ? selectedRecord['Plant Order'].item.jsondata.sexternalordertypename : selectedRecord&&selectedRecord.sexternalordertypename?selectedRecord.sexternalordertypename:''

        sampleRegistration["jsondata"]['externalorderid'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].label)||''
        sampleRegistration["jsonuidata"]['externalorderid'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].label)||''
        sampleRegistration["jsondata"]['nexternalordercode'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].value)||''
        sampleRegistration["jsonuidata"]['nexternalordercode'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].value)||''
       
    }

    const param = { sampleRegistration, dateList }
    return param;
}


export function getStabilityStudyPlan(masterData, selectedRecord, selectedSpec,
    templateList, userInfo, defaulttimezone, operation, comboComponents) {
    let sampleRegistration = {};
    let dateList = []
    sampleRegistration["nsampletypecode"] = masterData.RealSampleTypeValue.nsampletypecode;
    sampleRegistration["nregtypecode"] = masterData.RealRegTypeValue && masterData.RealRegTypeValue.nregtypecode||-1;
    sampleRegistration["nregsubtypecode"] = masterData.RealRegTypeValue && masterData.RealRegSubTypeValue.nregsubtypecode||-1;
    sampleRegistration["ndesigntemplatemappingcode"] =masterData.ndesigntemplatemappingcode && masterData.ndesigntemplatemappingcode||-1;
    sampleRegistration["nregsubtypeversioncode"] =masterData.RealRegTypeValue && masterData.RealRegSubTypeValue.nregsubtypeversioncode||-1;
    sampleRegistration["ntemplatemanipulationcode"] = operation === 'update' ? masterData.selectedSample[0].ntemplatemanipulationcode : selectedSpec.ntemplatemanipulationcode;
    sampleRegistration["nallottedspeccode"] = operation === 'update' ? masterData.selectedSample[0].nallottedspeccode : selectedSpec.nallottedspeccode.value;


    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.STABILITY) {
        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
        const protocolLabelName = comboComponents.filter(x => x.name === "protocol id");
        sampleRegistration["nprotocolcode"]  = selectedRecord[protocolLabelName[0].label] &&
        selectedRecord[protocolLabelName[0].label].value||-1;
    } else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.INSTRUMENT) {
        sampleRegistration["ninstrumentcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']].value : -1;
        sampleRegistration["ninstrumentcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.MATERIAL) {
        sampleRegistration["nmaterialcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']].value : -1;
        sampleRegistration["nmaterialcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')] && comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] !== undefined ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ngendercode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Gender')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Gender')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.PROJECTSAMPLETYPE) {
        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')] && comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] !== undefined ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["nprojectmastercode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Project Code')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Project Code')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }

    sampleRegistration["jsondata"] = {}
    sampleRegistration["jsonuidata"] = {}

    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.CLINICALTYPE) {
        sampleRegistration["jsondata"]['spatientid'] = selectedRecord['spatientid'] ? selectedRecord['spatientid'] : ''
        sampleRegistration["jsonuidata"]['spatientid'] = selectedRecord['spatientid'] ? selectedRecord['spatientid'] : ''
        sampleRegistration["jsondata"]['nexternalordertypecode'] = selectedRecord.Order && selectedRecord.Order.item && selectedRecord.Order.item.jsondata.nexternalordertypecode ? selectedRecord.Order.item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:-1
        sampleRegistration["jsonuidata"]['nexternalordertypecode'] = selectedRecord.Order && selectedRecord.Order.item && selectedRecord.Order.item.jsondata.nexternalordertypecode ? selectedRecord.Order.item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:-1
        sampleRegistration["jsondata"]["orderTypeValue"] = selectedRecord['Order Type'] && selectedRecord['Order Type'].value
        sampleRegistration["jsonuidata"]["orderTypeValue"] = selectedRecord['Order Type'] && selectedRecord['Order Type'].value
    }
    
    //console.log("save registration:", selectedRecord);
    templateList && templateList.map(row => {
        return row.children.map(column => {
            return column.children.map(component => {
                if (component.hasOwnProperty("children")) {
                    return component.children.map(componentrow => {
                        if (componentrow.inputtype === "combo" || componentrow.inputtype === "predefineddropdown") {
                            //  if(componentrow.recordbasedreadonly)
                            if (componentrow.inputtype === "predefineddropdown") {
                                sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    {
                                        value: selectedRecord[componentrow.label].value,
                                        label: selectedRecord[componentrow.label].label
                                        // pkey: componentrow.valuemember,
                                        // nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                        // source: componentrow.source,
                                        // [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]:  operation === "update"?
                                        // selectedRecord[componentrow.label].item? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                        // selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        //     :
                                        //     selectedRecord[componentrow.label].item? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: 
                                        //     selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]?  selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        //     :  selectedRecord[componentrow.label].vale

                                    } : -1
                                sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";

                            } else {
                                sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    {
                                        value: selectedRecord[componentrow.label].value,
                                        label: selectedRecord[componentrow.label].label,
                                        pkey: componentrow.valuemember,
                                        nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                        source: componentrow.source,
                                        [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: operation === "update" ?
                                            selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                            :
                                            selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                                selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] ? selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                    : selectedRecord[componentrow.label].value

                                    } : -1
                                sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";

                            }
                            //  sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";
                            if (componentrow.name === 'manualorderid') {
                                sampleRegistration["jsondata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'] ?
                                    sampleRegistration["jsondata"]['spatientid'] : selectedRecord[componentrow.label].item ?
                                        selectedRecord[componentrow.label].item['jsondata']['spatientid'] : "";

                                sampleRegistration["jsonuidata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'];
                                if (operation === 'update') {
                                    sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord["Patient Permanent Address"] ? selectedRecord["Patient Permanent Address"] : "";

                                    sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address'];


                                    sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord["Patient Current Address"] ? selectedRecord["Patient Current Address"] : "";

                                    sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address'];

                                    sampleRegistration["jsondata"]['External Id'] = selectedRecord["External Id"] ? selectedRecord["External Id"] : "";

                                    sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];

                                    sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord["Patient Passport No"] ? selectedRecord["Patient Passport No"] : "";
                                    sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No'];

                                    sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord["Patient Phone No"] ? selectedRecord["Patient Phone No"] : "";
                                    sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No'];

                                    sampleRegistration["jsondata"]['Institution Code'] = selectedRecord["Institution Code'"] ? selectedRecord["Institution Code'"] : "";
                                    sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code'];

                                    sampleRegistration["jsondata"]['District/City'] = selectedRecord["District/City"] ? selectedRecord["District/City"] : "";
                                    sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];

                                    sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord["Submitter Phone No"] ? selectedRecord["Submitter Phone No"] : "";
                                    sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No'];

                                }
                                else {

                                    sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['spermanentadd'] : ""

                                    sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address'];

                                    sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['scurrentadd'] : "";

                                    sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address'];

                                    sampleRegistration["jsondata"]['External Id'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sexternalid'] : "";

                                    sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];


                                    sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['spassportno'] : "";

                                    sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No'];

                                    sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sphoneno'] : "";

                                    sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No'];

                                    sampleRegistration["jsondata"]['Institution Code'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sinstitutioncode'] : "";

                                    sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code'];

                                    sampleRegistration["jsondata"]['District/City'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['sinsdistrictcity'] : "";

                                    sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];

                                    sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label].item['jsondata']['submittertelephone'] : "";

                                    sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No'];

                                }
                            }


                        }
                        else if (componentrow.inputtype === "date") {
                            if (componentrow.mandatory) {
                                sampleRegistration["jsondata"][componentrow.label] = (typeof selectedRecord[componentrow.label] === "object") ?
                                    convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[componentrow.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)
                                        : selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            } else {
                                sampleRegistration["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                    typeof selectedRecord[componentrow.label] === "object" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : new Date(), userInfo) :
                                        typeof selectedRecord[componentrow.label] === "number" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "" :
                                    selectedRecord[componentrow.label] ? typeof selectedRecord[componentrow.label] === "object" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : new Date(), userInfo) : typeof selectedRecord[componentrow.label] === "number" ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label]
                                                : "" : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            }
                            if (componentrow.timezone) {
                                sampleRegistration["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                    { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                    defaulttimezone ? defaulttimezone : -1

                                sampleRegistration["jsonuidata"][`tz${componentrow.label}`] = sampleRegistration["jsondata"][`tz${componentrow.label}`]
                            }
                            dateList.push(componentrow.label)
                        }

                        else {
                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                selectedRecord[componentrow.label] : ""

                            sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                        }
                    })
                    return sampleRegistration;

                }
                else {
                    if (component.inputtype === "combo" || component.inputtype === "predefineddropdown") {
                        if (component.inputtype === "predefineddropdown") {
                            sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                                {
                                    value: selectedRecord[component.label].value,
                                    label: selectedRecord[component.label].label,
                                    // pkey: component.valuemember,
                                    // nquerybuildertablecode: component.nquerybuildertablecode,
                                    // source: component.source,
                                    // [component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]:  operation === "update"?
                                    // selectedRecord[component.label].item? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                    //     selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    //         :
                                    //         selectedRecord[component.label].item? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: 
                                    //         selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]?  selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    //         :  selectedRecord[component.label].vale

                                } : -1
                            sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";

                        } else {
                            sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                                {
                                    value: selectedRecord[component.label].value,
                                    label: selectedRecord[component.label].label,
                                    pkey: component.valuemember,
                                    nquerybuildertablecode: component.nquerybuildertablecode,
                                    source: component.source,
                                    [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: operation === "update" ?
                                        selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                            selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                        :
                                        selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                            selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] ? selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                                : selectedRecord[component.label].value

                                } : -1
                            sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";

                        }
                        if (component.name === 'manualorderid') {
                            sampleRegistration["jsondata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'] ?
                                sampleRegistration["jsondata"]['spatientid'] : selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['spatientid'] : "";

                            sampleRegistration["jsonuidata"]['spatientid'] = sampleRegistration["jsondata"]['spatientid'];

                            if (operation === 'update') {
                                sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord["Patient Permanent Address"] ? selectedRecord["Patient Permanent Address"] : "";

                                sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address'];


                                sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord["Patient Current Address"] ? selectedRecord["Patient Current Address"] : "";

                                sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address'];

                                sampleRegistration["jsondata"]['External Id'] = selectedRecord["External Id"] ? selectedRecord["External Id"] : "";

                                sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];

                                sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord["Patient Passport No"] ? selectedRecord["Patient Passport No"] : "";
                                sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No'];

                                sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord["Patient Phone No"] ? selectedRecord["Patient Phone No"] : "";
                                sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No'];

                                sampleRegistration["jsondata"]['Institution Code'] = selectedRecord["Institution Code'"] ? selectedRecord["Institution Code'"] : "";
                                sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code'];

                                sampleRegistration["jsondata"]['District/City'] = selectedRecord["District/City"] ? selectedRecord["District/City"] : "";
                                sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];

                                sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord["Submitter Phone No"] ? selectedRecord["Submitter Phone No"] : "";
                                sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No'];

                            }
                            else {

                                sampleRegistration["jsondata"]['Patient Permanent Address'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['spermanentadd'] : ""

                                sampleRegistration["jsonuidata"]['Patient Permanent Address'] = sampleRegistration["jsondata"]['Patient Permanent Address']


                                sampleRegistration["jsondata"]['Patient Current Address'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['scurrentadd'] : ""

                                sampleRegistration["jsonuidata"]['Patient Current Address'] = sampleRegistration["jsondata"]['Patient Current Address']


                                sampleRegistration["jsondata"]['External Id'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sexternalid'] : "";

                                sampleRegistration["jsonuidata"]['External Id'] = sampleRegistration["jsondata"]['External Id'];

                                sampleRegistration["jsondata"]['OrderIdData'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sexternalorderid'] : "";

                                sampleRegistration["jsonuidata"]['OrderIdData'] = sampleRegistration["jsondata"]['OrderIdData'];


                                sampleRegistration["jsondata"]['OrderCodeData'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['nexternalordercode'] : "";

                                sampleRegistration["jsonuidata"]['OrderCodeData'] = sampleRegistration["jsondata"]['OrderCodeData'];


                                sampleRegistration["jsondata"]['Patient Passport No'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['spassportno'] : ""

                                sampleRegistration["jsonuidata"]['Patient Passport No'] = sampleRegistration["jsondata"]['Patient Passport No']


                                sampleRegistration["jsondata"]['Patient Phone No'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sphoneno'] : ""

                                sampleRegistration["jsonuidata"]['Patient Phone No'] = sampleRegistration["jsondata"]['Patient Phone No']


                                sampleRegistration["jsondata"]['Institution Code'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sinstitutioncode'] : ""

                                sampleRegistration["jsonuidata"]['Institution Code'] = sampleRegistration["jsondata"]['Institution Code']

                                sampleRegistration["jsondata"]['District/City'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['sinsdistrictcity'] : ""

                                sampleRegistration["jsonuidata"]['District/City'] = sampleRegistration["jsondata"]['District/City'];


                                sampleRegistration["jsondata"]['Submitter Phone No'] = selectedRecord[component.label] ?
                                    selectedRecord[component.label].item['jsondata']['submittertelephone'] : ""

                                sampleRegistration["jsonuidata"]['Submitter Phone No'] = sampleRegistration["jsondata"]['Submitter Phone No']

                            }
                        }
                    }
                    else if (component.inputtype === "date") {
                        if (component.mandatory) {
                            console.log(typeof selectedRecord[component.label] === "object")
                            sampleRegistration["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?

                                convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) :
                                (typeof selectedRecord[component.label] === "number") ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        new Date(selectedRecord[component.label]) : new Date(), userInfo) :
                                    selectedRecord[component.label] ?
                                        selectedRecord[component.label] : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        } else {
                            sampleRegistration["jsondata"][component.label] = component.loadcurrentdate ?
                                typeof selectedRecord[component.label] === "object" ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        selectedRecord[component.label] : new Date(), userInfo) :
                                    typeof selectedRecord[component.label] === "number" ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo)

                                        : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" :
                                selectedRecord[component.label] ? typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) : typeof selectedRecord[component.label] === "number" ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        new Date(selectedRecord[component.label]) : new Date(), userInfo)
                                    : selectedRecord[component.label] ?
                                        selectedRecord[component.label] : "" : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        }
                        if (component.timezone) {
                            sampleRegistration["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                defaulttimezone ? defaulttimezone : -1

                            sampleRegistration["jsonuidata"][`tz${component.label}`] = sampleRegistration["jsondata"][`tz${component.label}`]
                        }
                        dateList.push(component.label)
                    }
                    else {
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            selectedRecord[component.label] : ""

                        sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                    }
                    return sampleRegistration;
                }
            }
            )
        })
    })

    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.PRODUCT && selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata) {
        sampleRegistration["jsondata"]['nexternalordertypecode'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode ? selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:''
        sampleRegistration["jsonuidata"]['nexternalordertypecode'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode ? selectedRecord['Plant Order'].item.jsondata.nexternalordertypecode : selectedRecord&&selectedRecord.nexternalordertypecode?selectedRecord.nexternalordertypecode:''
        sampleRegistration["jsondata"]['sexternalordertypename'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.sexternalordertypename ? selectedRecord['Plant Order'].item.jsondata.sexternalordertypename : selectedRecord&&selectedRecord.sexternalordertypename?selectedRecord.sexternalordertypename:''
        sampleRegistration["jsonuidata"]['sexternalordertypename'] = selectedRecord['Plant Order'] && selectedRecord['Plant Order'].item && selectedRecord['Plant Order'].item.jsondata.sexternalordertypename ? selectedRecord['Plant Order'].item.jsondata.sexternalordertypename : selectedRecord&&selectedRecord.sexternalordertypename?selectedRecord.sexternalordertypename:''

        sampleRegistration["jsondata"]['externalorderid'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].label)||''
        sampleRegistration["jsonuidata"]['externalorderid'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].label)||''
        sampleRegistration["jsondata"]['nexternalordercode'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].value)||''
        sampleRegistration["jsonuidata"]['nexternalordercode'] = (selectedRecord['Plant Order'] && selectedRecord['Plant Order'].value)||''
       
    }

    const param = { sampleRegistration, dateList }
    return param;
}
export function getRegistrationScheduler(masterData, selectedRecord, selectedSpec,
    templateList, userInfo, defaulttimezone, operation, comboComponents) {
    let sampleRegistration = {};
    let dateList = []
    sampleRegistration["nsampletypecode"] = masterData.RealSampleTypeValue ? masterData.RealSampleTypeValue.nsampletypecode : 1;
    sampleRegistration["nregtypecode"] = masterData.RealRegTypeValue ? masterData.RealRegTypeValue.nregtypecode : 1;
    sampleRegistration["nregsubtypecode"] = masterData.RealRegSubTypeValue ? masterData.RealRegSubTypeValue.nregsubtypecode : 1;
    sampleRegistration["ndesigntemplatemappingcode"] = masterData.RealDesignTemplateMappingValue ?
        masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode : masterData.ndesigntemplatemappingcode;
    sampleRegistration["nregsubtypeversioncode"] = masterData.RealRegSubTypeValue ?
        masterData.RealRegSubTypeValue.nregsubtypeversioncode : masterData.nregsubtypeversioncode ? masterData.nregsubtypeversioncode : -1;
    sampleRegistration["ntemplatemanipulationcode"] = operation === 'update' ? masterData.selectedSample.ntemplatemanipulationcode : selectedSpec.ntemplatemanipulationcode;
    sampleRegistration["nallottedspeccode"] = operation === 'update' ? masterData.selectedSample.nallottedspeccode : selectedSpec.nallottedspeccode.value;


    if (sampleRegistration["nsampletypecode"] === 1) {

        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    } else if (masterData.RealSampleTypeValue.nsampletypecode === 2) {
        sampleRegistration["ninstrumentcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']].value : -1;
        sampleRegistration["ninstrumentcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === 3) {
        sampleRegistration["nmaterialcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']].value : -1;
        sampleRegistration["nmaterialcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
    }

    sampleRegistration["jsondata"] = {}
    sampleRegistration["jsonuidata"] = {}



    templateList && templateList.map(row => {
        return row.children.map(column => {
            return column.children.map(component => {
                if (component.hasOwnProperty("children")) {
                    return component.children.map(componentrow => {
                        if (componentrow.inputtype === "combo") {
                            //  if(componentrow.recordbasedreadonly)
                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                { value: selectedRecord[componentrow.label].value, label: selectedRecord[componentrow.label].label } : -1
                            sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : ""

                        }
                        else if (componentrow.inputtype === "date") {
                            if (componentrow.mandatory) {
                                sampleRegistration["jsondata"][componentrow.label] = typeof selectedRecord[componentrow.label] === "object" ?
                                    convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) : selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            } else {
                                sampleRegistration["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                    typeof selectedRecord[componentrow.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) : selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : "" :
                                    selectedRecord[componentrow.label] ? typeof selectedRecord[componentrow.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) : selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : "" : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            }
                            if (componentrow.timezone) {
                                sampleRegistration["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                    { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                    defaulttimezone ? defaulttimezone : -1

                                sampleRegistration["jsonuidata"][`tz${componentrow.label}`] = sampleRegistration["jsondata"][`tz${componentrow.label}`]
                            }
                            dateList.push(componentrow.label)
                        }

                        else {
                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                selectedRecord[componentrow.label] : ""

                            sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                        }
                    })
                    return sampleRegistration;

                }
                else {
                    if (component.inputtype === "combo") {
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            { value: selectedRecord[component.label].value, label: selectedRecord[component.label].label } : -1

                        sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                    }
                    else if (component.inputtype === "date") {
                        if (component.mandatory) {
                            sampleRegistration["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?
                                convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) :
                                selectedRecord[component.label] ?
                                    selectedRecord[component.label] : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        } else {
                            sampleRegistration["jsondata"][component.label] = component.loadcurrentdate ?
                                typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) : selectedRecord[component.label] ?
                                    selectedRecord[component.label] : "" :
                                selectedRecord[component.label] ? typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) : selectedRecord[component.label] ?
                                    selectedRecord[component.label] : "" : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        }
                        if (component.timezone) {
                            sampleRegistration["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                defaulttimezone ? defaulttimezone : -1

                            sampleRegistration["jsonuidata"][`tz${component.label}`] = sampleRegistration["jsondata"][`tz${component.label}`]
                        }
                        dateList.push(component.label)
                    }
                    else {
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            selectedRecord[component.label] : ""

                        sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                    }
                    return sampleRegistration;
                }
            }
            )
        })
    })
    const param = { sampleRegistration, dateList }
    return param;
}
// export function getComponentListfromUnwantedAttr(Components) {
//     Components.map(component => {
//         // if (component.ncomponentcode !== null && typeof component.ncomponentcode === "object") {
//         //     component.ncomponentcode = component.ncomponentcode.value;
//         // }

//         // component['jsondata']['ssubsamplename'] = component['ssubsamplename'] ? component['ssubsamplename'] : ""
//         // component['jsondata']['ssampleqty'] = component['ssampleqty'] ? component['ssampleqty'] : ""
//         // component['jsondata']['nunitcode'] = { value: component.nunitcode, label: component.sunitname };
//         // component['jsondata']['scomments'] = component['scomments'] ? component['scomments'] : ""


//         return component;
//     });
//     return Components;
// }


export function getRegistrationSubSample(selectedRecord,
    templateList, userInfo, defaulttimezone, preRegPopUp, specBasedComponent, selectedSpec, operation) {
    let sampleRegistration = {};
    let dateList = []
    // let dataGridList={}
    // sampleRegistration["ntemplatemanipulationcode"] = selectedSpec.ntemplatemanipulationcode;
    // sampleRegistration["nallottedspeccode"] = selectedSpec.nallottedspeccode.value;

    sampleRegistration["jsondata"] = {}
    sampleRegistration["jsonuidata"] = {}
    templateList && templateList.map(row => {
        return row.children.map(column => {
            return column.children.map(component => {
                if (component.hasOwnProperty("children")) {
                    //  let componentrowlabel = ''
                    // let componentrowvalue = ''
                    return component.children.map(componentrow => {

                        if (componentrow.inputtype === "combo"|| componentrow.inputtype === "predefineddropdown") {
                            if (componentrow.inputtype === "predefineddropdown") {
                                sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                    {
                                        value: selectedRecord[componentrow.label].value,
                                        label: selectedRecord[componentrow.label].label
                                        // pkey: componentrow.valuemember,
                                        // nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                        // source: componentrow.source,
                                        // [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]:  operation === "update"?
                                        // selectedRecord[componentrow.label].item? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                        // selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        //     :
                                        //     selectedRecord[componentrow.label].item? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]:
                                        //     selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]?  selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        //     :  selectedRecord[componentrow.label].vale
 
                                    } : -1
                                sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : "";
 
                            }else{
                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                {
                                    value: selectedRecord[componentrow.label].value,
                                    label: selectedRecord[componentrow.label].label,
                                    //   pkey: operation && operation==='update'?
                                    //         selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.pkey
                                    //         :selectedRecord[componentrow.label].pkey
                                    //         :selectedRecord[componentrow.label].item.pkey,
                                    pkey: componentrow.valuemember,
                                    nquerybuildertablecode: componentrow.nquerybuildertablecode,
                                    source: componentrow.source,
                                    [componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]: operation === "update" ?
                                        selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                            selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                        :
                                        selectedRecord[componentrow.label].item ? selectedRecord[componentrow.label].item.jsondata[componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] :
                                            selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember] ? selectedRecord[componentrow.label][componentrow.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : componentrow.valuemember]
                                                : selectedRecord[componentrow.label].value
                                    // nquerybuildertablecode:operation&&operation==='update'?selectedRecord[componentrow.label].item ?selectedRecord[componentrow.label].item.nquerybuildertablecode :selectedRecord[componentrow.label].nquerybuildertablecode :selectedRecord[componentrow.label].item.nquerybuildertablecode,
                                    // source:operation&&operation==='update'?selectedRecord[componentrow.label].item?selectedRecord[componentrow.label].item.source: selectedRecord[componentrow.label].source:selectedRecord[componentrow.label].item.source
                                } : -1

                            sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : ""
                            }// if (componentrow.mandatory || selectedRecord[componentrow.label]) {
                            //     componentrowlabel = componentrowlabel + '&' + componentrow.label
                            //     componentrowvalue = componentrowvalue + ' ' + selectedRecord[componentrow.label].label
                            // }
							// ALPD-3575
                            if(componentrow.name === "sampleappearance"){
                                sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'nsampleappearancecode': sampleRegistration["jsondata"][componentrow.label].value, 
                                'ssampleappearance': sampleRegistration["jsondata"][componentrow.label].label}
                                sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'nsampleappearancecode': sampleRegistration["jsondata"][componentrow.label].value,
                                'ssampleappearance': sampleRegistration["jsondata"][componentrow.label].label}
                            }
                        }
                        else if (componentrow.inputtype === "date") {
                            if (componentrow.mandatory) {
                                sampleRegistration["jsondata"][componentrow.label] = typeof selectedRecord[componentrow.label] === "object" ?
                                    convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[componentrow.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                            new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)

                                        : selectedRecord[componentrow.label] ?
                                            selectedRecord[componentrow.label] : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            } else {
                                sampleRegistration["jsondata"][componentrow.label] = componentrow.loadcurrentdate ?
                                    typeof selectedRecord[componentrow.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) :
                                        (typeof selectedRecord[componentrow.label] === "number") ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)
                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "" :
                                    selectedRecord[componentrow.label] ? typeof selectedRecord[componentrow.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                        selectedRecord[componentrow.label] : new Date(), userInfo) :
                                        (typeof selectedRecord[componentrow.label] === "number") ?
                                            convertDateTimetoStringDBFormat(selectedRecord[componentrow.label] ?
                                                new Date(selectedRecord[componentrow.label]) : new Date(), userInfo)
                                            : selectedRecord[componentrow.label] ?
                                                selectedRecord[componentrow.label] : "" : "";

                                sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            }
                            if (componentrow.timezone) {
                                sampleRegistration["jsondata"][`tz${componentrow.label}`] = selectedRecord[`tz${componentrow.label}`] ?
                                    { value: selectedRecord[`tz${componentrow.label}`].value, label: selectedRecord[`tz${componentrow.label}`].label } :
                                    defaulttimezone ? defaulttimezone : -1

                                sampleRegistration["jsonuidata"][`tz${componentrow.label}`] = sampleRegistration["jsondata"][`tz${componentrow.label}`]
                            }
							// ALPD-3575
                            if(componentrow.name === "subsamplecollectiondatetime"){
                                sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'subsamplecollectiondatetime': sampleRegistration["jsondata"][componentrow.label]}
                                sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'subsamplecollectiondatetime': sampleRegistration["jsonuidata"][componentrow.label], userInfo}
                        }
                        if(componentrow.name === "Occurrence Date"){
                            sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'Occurrence Date': sampleRegistration["jsondata"][componentrow.label]}
                            sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'Occurrence Date': sampleRegistration["jsonuidata"][componentrow.label]}
                         }
                            dateList.push(componentrow.label)
                        }
                        else if (componentrow.inputtype === "files") {
                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                selectedRecord[componentrow.label] : ""
                            sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            let tempData = {}
                            if (typeof selectedRecord[componentrow && componentrow.label] === "object") {
                                selectedRecord[componentrow && componentrow.label] && selectedRecord[componentrow && componentrow.label].forEach((item1, index) => {
                                    const fileName = create_UUID();
                                    const splittedFileName = item1.name.split('.');
                                    const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                                    const uniquefilename = fileName + '.' + fileExtension;
                                    tempData[componentrow && componentrow.label + '_susername_subSample'] = userInfo.susername
                                    tempData[componentrow && componentrow.label + '_suserrolename_subSample'] = userInfo.suserrolename
                                    tempData[componentrow && componentrow.label + '_nfilesize_subSample'] = item1.size
                                    tempData[componentrow && componentrow.label + '_ssystemfilename_subSample'] = uniquefilename
                                    tempData[componentrow && componentrow.label] = Lims_JSON_stringify(item1.name.trim(), false)

                                    sampleRegistration["jsondata"] = {
                                        ...sampleRegistration["jsondata"],
                                        ...tempData
                                    };
                                    sampleRegistration["jsonuidata"] = {
                                        ...sampleRegistration["jsonuidata"],
                                        ...tempData
                                    };
                                    sampleRegistration['uniquefilename'] = uniquefilename;
                                    sampleRegistration[selectedRecord[componentrow.label]] = selectedRecord[componentrow.label]
                                }

                                )
                            }
                        }

                        else {

                            sampleRegistration["jsondata"][componentrow.label] = selectedRecord[componentrow.label] ?
                                selectedRecord[componentrow.label] : ""

                            sampleRegistration["jsonuidata"][componentrow.label] = sampleRegistration["jsondata"][componentrow.label]
                            if (componentrow.name === 'externalsampleid') {
                                 //sampleRegistration["jsondata"]['sampleorderid'] = sampleRegistration["jsondata"][componentrow.label]
                                //sampleRegistration["jsonuidata"]['sampleorderid'] = sampleRegistration["jsondata"][componentrow.label]
                                sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'sampleorderid': sampleRegistration["jsondata"][componentrow.label],
                                'nordertypecode': orderType.MANUAL,'sordertypename': "Manual"}
                                sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'sampleorderid': sampleRegistration["jsondata"][componentrow.label],
                                'nordertypecode': orderType.MANUAL,'sordertypename': "Manual"}
                            }
                            // if (selectedRecord[componentrow.label]) {
                            //     componentrowlabel = componentrowlabel + '&' + componentrow.label
                            //     componentrowvalue = componentrowvalue + ' ' + selectedRecord[componentrow.label]
                            // }
                        }
                        return sampleRegistration;
                    })

                    //  sampleRegistration["jsondata"][componentrowlabel.substring(1)] = componentrowvalue
                }
                else {
                    if (component.inputtype === "combo"|| component.inputtype === "predefineddropdown") {
                        if (component.inputtype === "predefineddropdown") {
                            sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                                {
                                    value: selectedRecord[component.label].value,
                                    label: selectedRecord[component.label].label,
                                    // pkey: component.valuemember,
                                    // nquerybuildertablecode: component.nquerybuildertablecode,
                                    // source: component.source,
                                    // [component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]:  operation === "update"?
                                    // selectedRecord[component.label].item? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                    //     selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    //         :
                                    //         selectedRecord[component.label].item? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]:
                                    //         selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]?  selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    //         :  selectedRecord[component.label].vale
 
                                } : -1
                            sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : "";
 
                        } else{
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            {
                                value: selectedRecord[component.label].value,
                                label: selectedRecord[component.label].label,
                                //   pkey: operation&&operation==='update'?selectedRecord[component.label].item?selectedRecord[component.label].item.pkey:selectedRecord[component.label].pkey:selectedRecord[component.label].item.pkey,
                                //   nquerybuildertablecode:operation&&operation==='update'?selectedRecord[component.label].item ?selectedRecord[component.label].item.nquerybuildertablecode :selectedRecord[component.label].nquerybuildertablecode :selectedRecord[component.label].item.nquerybuildertablecode,
                                //   source:operation&&operation==='update'?selectedRecord[component.label].item?selectedRecord[component.label].item.source: selectedRecord[component.label].source:selectedRecord[component.label].item.source
                                pkey: component.valuemember,
                                nquerybuildertablecode: component.nquerybuildertablecode,
                                source: component.source,
                                [component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]: operation === "update" ?
                                    selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                        selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                    :
                                    selectedRecord[component.label].item ? selectedRecord[component.label].item.jsondata[component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] :
                                        selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember] ? selectedRecord[component.label][component.table.item.component === 'Dynamic' ? 'ndynamicmastercode' : component.valuemember]
                                            : selectedRecord[component.label].value
                            } : -1

                        sampleRegistration["jsonuidata"][component.label] = selectedRecord[component.label] ? selectedRecord[component.label].label : ""
                        }// ALPD-3575
                        if(component.name === "sampleappearance"){
                            sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'nsampleappearancecode': sampleRegistration["jsondata"][component.label].value, 
                            'ssampleappearance': sampleRegistration["jsondata"][component.label].label}
                            sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'nsampleappearancecode': sampleRegistration["jsondata"][component.label].value,
                            'ssampleappearance': sampleRegistration["jsondata"][component.label].label}
                        }
                    }
                    else if (component.inputtype === "date") {
                        if (component.mandatory) {
                            sampleRegistration["jsondata"][component.label] = typeof selectedRecord[component.label] === "object" ?
                                convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) :
                                (typeof selectedRecord[component.label] === "number") ?
                                    convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                        new Date(selectedRecord[component.label]) : new Date(), userInfo)
                                    : selectedRecord[component.label] ?
                                        selectedRecord[component.label] : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        } else {
                            sampleRegistration["jsondata"][component.label] = component.loadcurrentdate ?
                                typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[component.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo)
                                        : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" :
                                selectedRecord[component.label] ? typeof selectedRecord[component.label] === "object" ? convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                    selectedRecord[component.label] : new Date(), userInfo) :
                                    (typeof selectedRecord[component.label] === "number") ?
                                        convertDateTimetoStringDBFormat(selectedRecord[component.label] ?
                                            new Date(selectedRecord[component.label]) : new Date(), userInfo)
                                        : selectedRecord[component.label] ?
                                            selectedRecord[component.label] : "" : "";

                            sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        }
                        if (component.timezone) {
                            sampleRegistration["jsondata"][`tz${component.label}`] = selectedRecord[`tz${component.label}`] ?
                                { value: selectedRecord[`tz${component.label}`].value, label: selectedRecord[`tz${component.label}`].label } :
                                defaulttimezone ? defaulttimezone : -1

                            sampleRegistration["jsonuidata"][`tz${component.label}`] = sampleRegistration["jsondata"][`tz${component.label}`]
                        }
						// ALPD-3575
                        if(component.name === "subsamplecollectiondatetime"){
                                sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'subsamplecollectiondatetime': sampleRegistration["jsondata"][component.label]}
                                sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'subsamplecollectiondatetime': sampleRegistration["jsonuidata"][component.label], userInfo}
                        }
                        if(component.name === "Occurrence Date"){
                            sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'Occurrence Date': sampleRegistration["jsondata"][component.label]}
                            sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'Occurrence Date': sampleRegistration["jsonuidata"][component.label]}
                         }
                        dateList.push(component.label)
                    } else if (component.inputtype === "files") {
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            selectedRecord[component.label] : ""
                        sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        let tempData = {}
                        if (typeof selectedRecord[component && component.label] === "object") {
                            selectedRecord[component && component.label] && selectedRecord[component && component.label].forEach((item1, index) => {
                                const fileName = create_UUID();
                                const splittedFileName = item1.name.split('.');
                                const fileExtension = item1.name.split('.')[splittedFileName.length - 1];
                                const uniquefilename = fileName + '.' + fileExtension;
                                tempData[component && component.label + '_susername_subSample'] = userInfo.susername
                                tempData[component && component.label + '_suserrolename_subSample'] = userInfo.suserrolename
                                tempData[component && component.label + '_nfilesize_subSample'] = item1.size
                                tempData[component && component.label + '_ssystemfilename_subSample'] = uniquefilename
                                tempData[component && component.label] = Lims_JSON_stringify(item1.name.trim(), false)
                                sampleRegistration["jsondata"] = {
                                    ...sampleRegistration["jsondata"],
                                    ...tempData
                                };
                                sampleRegistration["jsonuidata"] = {
                                    ...sampleRegistration["jsonuidata"],
                                    ...tempData
                                };
                                sampleRegistration['uniquefilename'] = uniquefilename;
                                sampleRegistration[component.label] = selectedRecord[component.label]
                            }
                            )
                        }
                    }
                    else {
                        sampleRegistration["jsondata"][component.label] = selectedRecord[component.label] ?
                            selectedRecord[component.label] : ""

                        sampleRegistration["jsonuidata"][component.label] = sampleRegistration["jsondata"][component.label]
                        if (component.name === 'externalsampleid') {
                            //sampleRegistration["jsondata"]['sampleorderid'] = sampleRegistration["jsondata"][component.label]
                            //sampleRegistration["jsonuidata"]['sampleorderid'] = sampleRegistration["jsondata"][component.label]
                            sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'sampleorderid': sampleRegistration["jsondata"][component.label],
                            'nordertypecode': orderType.MANUAL,'sordertypename': "Manual"}
                            sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'sampleorderid': sampleRegistration["jsondata"][component.label],
                            'nordertypecode': orderType.MANUAL,'sordertypename': "Manual"}
                        }
                    }
                    return sampleRegistration;
                }

            }
            )
        })
    })
    if (preRegPopUp) {
        sampleRegistration["nallottedspeccode"] = selectedSpec["nallottedspeccode"] ? selectedSpec["nallottedspeccode"].value : -1;
        if (specBasedComponent) {
            sampleRegistration["scomponentname"] = selectedRecord["ncomponentcode"].label;
            sampleRegistration["jsonuidata"]["scomponentname"] = sampleRegistration["scomponentname"]

            sampleRegistration["ncomponentcode"] = selectedRecord["ncomponentcode"] ? selectedRecord["ncomponentcode"].value : -1;
            sampleRegistration["nspecsampletypecode"] = selectedRecord["nspecsampletypecode"] ? selectedRecord["nspecsampletypecode"] : -1;
        } else {
            sampleRegistration["nspecsampletypecode"] = selectedSpec["nallottedspeccode"] ? selectedSpec["nallottedspeccode"]['item'].nspecsampletypecode : -1;
        }
    } else {
        if (specBasedComponent) {
            sampleRegistration["scomponentname"] = selectedRecord["ncomponentcode"].label;
            sampleRegistration["jsonuidata"]["scomponentname"] = sampleRegistration["scomponentname"]

            sampleRegistration["ncomponentcode"] = selectedRecord["ncomponentcode"] ? selectedRecord["ncomponentcode"].value : -1;
            sampleRegistration["nspecsampletypecode"] = selectedRecord["nspecsampletypecode"] ? selectedRecord["nspecsampletypecode"] : -1;
        } else {
            //  sampleRegistration["nspecsampletypecode"] = selectedRecord["nspecsampletypecode"] ? selectedRecord.nspecsampletypecode : -1;
            sampleRegistration["ncomponentcode"] = selectedRecord["ncomponentcode"] ? selectedRecord["ncomponentcode"] : -1;
        }
    }
    const param = { sampleRegistration, dateList }
    return param;
}
export function checkTestPresent(Test, Samples) {

    const filterArray = Samples.filter(function (x) {
        return !Test.some(function (y) {
            return x["npreregno"] === y["npreregno"] && (y["ntransactionstatus"] !== transactionStatus.REJECT && y["ntransactionstatus"] !== transactionStatus.CANCELLED)
        });
    });
    return filterArray.length > 0 ? false : true
}

// //added by perumalraj on 23/12/2020
// //compare two arrays of object and filter the record which are not present in the second array and vice versa
// export function filterStatusBasedOnTwoArrays(firstArray, secondArray, PrimaryKey) {

//     const filterArray = firstArray.filter(function (x) {
//         return secondArray.some(function (y) {
//             return x[PrimaryKey] === y[PrimaryKey]
//         })
//     });
//     return filterArray;
// }

export function getRegistrationRoutine(selectedRecord) {

    let sampleRegistrationRoutine = {};
    sampleRegistrationRoutine["nclientcode"] = selectedRecord.nclientcode ? selectedRecord.nclientcode.value : -1;
    sampleRegistrationRoutine["nmanufcode"] = selectedRecord.nmanufcode ? selectedRecord.nmanufcode.value : -1;
    sampleRegistrationRoutine["nsuppliercode"] = selectedRecord.nsuppliercode ? selectedRecord.nsuppliercode.value : -1;
    sampleRegistrationRoutine["ssamplecondition"] = selectedRecord.ssamplecondition ? selectedRecord.ssamplecondition : '';
    sampleRegistrationRoutine["nstorageconditioncode"] = selectedRecord.nstorageconditioncode ? selectedRecord.nstorageconditioncode.value : -1;
    sampleRegistrationRoutine["dreceiveddate"] = selectedRecord["dreceiveddate"] ? formatInputDate(selectedRecord["dreceiveddate"], false) : 'null';
    sampleRegistrationRoutine["sreceiveddate"] = selectedRecord["dreceiveddate"] ? formatInputDate(selectedRecord["dreceiveddate"], false) : 'null';
    sampleRegistrationRoutine["ntzdreceivedate"] = selectedRecord.ntzdreceivedate ? selectedRecord.ntzdreceivedate.value : -1;
    sampleRegistrationRoutine["stzdreceivedate"] = selectedRecord.stzdreceivedate ? selectedRecord.stzdreceivedate.label : -1;
    sampleRegistrationRoutine["ncontainertypecode"] = selectedRecord.ncontainertypecode ? selectedRecord.ncontainertypecode.value : -1;
    sampleRegistrationRoutine["sourfile"] = selectedRecord.sourfile ? selectedRecord.sourfile : '';
    sampleRegistrationRoutine["sbatchno"] = selectedRecord.sbatchno ? selectedRecord.sbatchno : '';
    sampleRegistrationRoutine["slotno"] = selectedRecord.slotno ? selectedRecord.slotno : '';
    sampleRegistrationRoutine["ndisposition"] = selectedRecord.ndisposition ? selectedRecord.ndisposition.value : -1;
    sampleRegistrationRoutine["stotalqty"] = selectedRecord.stotalqty ? selectedRecord.stotalqty : '0';
    sampleRegistrationRoutine["ntotalunitcode"] = selectedRecord.ntotalunitcode ? selectedRecord.ntotalunitcode.value : -1;
    sampleRegistrationRoutine["npriority"] = selectedRecord.npriority ? selectedRecord.npriority.value : -1;
    sampleRegistrationRoutine["sdeadline"] = selectedRecord.sdeadline ? selectedRecord.sdeadline : '0';
    sampleRegistrationRoutine["nperiodconfigcode"] = selectedRecord.nperiodconfigcode ? selectedRecord.nperiodconfigcode.value : -1;
    sampleRegistrationRoutine["sremarks"] = selectedRecord.sremarks ? selectedRecord.sremarks : null;
    sampleRegistrationRoutine["sreportremarks"] = selectedRecord.sreportremarks ? selectedRecord.sreportremarks : null;
    sampleRegistrationRoutine["sdeviationcomments"] = selectedRecord.sdeviationcomments ? selectedRecord.sdeviationcomments : null;

    return sampleRegistrationRoutine;
}