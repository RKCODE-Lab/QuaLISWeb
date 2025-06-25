
import { convertDateTimetoStringDBFormat,  Lims_JSON_stringify, create_UUID } from '../../components/CommonScript';
import {  orderType,SampleType  } from '../../components/Enumeration';


export function getRegistrationSubSample(selectedRecord,
    templateList, userInfo, defaulttimezone, preRegPopUp, specBasedComponent, selectedSpec, operation) {
    let sampleRegistration = {};
    let dateList = []
    sampleRegistration["jsondata"] = {}
    sampleRegistration["jsonuidata"] = {}
    templateList && templateList.map(row => {
        return row.children.map(column => {
            return column.children.map(component => {
                if (component.hasOwnProperty("children")) {
                    //  let componentrowlabel = ''
                    // let componentrowvalue = ''
                    return component.children.map(componentrow => {

                        if (componentrow.inputtype === "combo") {
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

                            sampleRegistration["jsonuidata"][componentrow.label] = selectedRecord[componentrow.label] ? selectedRecord[componentrow.label].label : ""
                     
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
                                
                                sampleRegistration["jsondata"]= {...sampleRegistration["jsondata"],'sampleorderid': sampleRegistration["jsondata"][componentrow.label],
                                'nordertypecode': orderType.MANUAL,'sordertypename': "Manual"}
                                sampleRegistration["jsonuidata"]= {...sampleRegistration["jsonuidata"],'sampleorderid': sampleRegistration["jsondata"][componentrow.label],
                                'nordertypecode': orderType.MANUAL,'sordertypename': "Manual"}
                            }
                    
                        }
                        return sampleRegistration;
                    })

                }
                else {
                    if (component.inputtype === "combo") {
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
						// ALPD-3575
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




export function getSchedulerConfig(masterData, selectedRecord, selectedSpec,
    templateList, userInfo, defaulttimezone, operation, comboComponents) {
    let sampleRegistration = {};
    let dateList = []
    sampleRegistration["nsampletypecode"] = masterData.RealSampleTypeValue.nsampletypecode;
    sampleRegistration["nregtypecode"] = masterData.RealRegTypeValue.nregtypecode;
    sampleRegistration["nregsubtypecode"] = masterData.RealRegSubTypeValue.nregsubtypecode;
    sampleRegistration["ndesigntemplatemappingcode"] = masterData.RealDesignTemplateMappingValue.ndesigntemplatemappingcode;
    sampleRegistration["nregsubtypeversioncode"] = masterData.RealRegSubTypeValue.nregsubtypeversioncode;
    sampleRegistration["ntemplatemanipulationcode"] = operation === 'update' ? masterData.selectedSample[0].ntemplatemanipulationcode : selectedSpec.ntemplatemanipulationcode;
    sampleRegistration["nallottedspeccode"] = operation === 'update' ? masterData.selectedSample[0].nallottedspeccode : selectedSpec.nallottedspeccode.value;
    sampleRegistration["nschedulecode"] = masterData.SchedulerConfigTypeValue && masterData.SchedulerConfigTypeValue.nsampleschedulerconfigtypecode==1?-1: selectedRecord['SchedulerMaster'] ? selectedRecord['SchedulerMaster'].value:-1;


    if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.PRODUCT) {

        sampleRegistration["nproductcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product Category')]['label']].value : -1;
        sampleRegistration["nproductcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Product')]['label']].value : -1;
        sampleRegistration["ninstrumentcatcode"] = -1
        sampleRegistration["ninstrumentcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
        sampleRegistration["nmaterialinventorycode"] = -1
    } else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.INSTRUMENT) {
        sampleRegistration["ninstrumentcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument Category')]['label']].value : -1;
        sampleRegistration["ninstrumentcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Instrument')]['label']].value : -1;
        sampleRegistration["nproductcatcode"] = -1
        sampleRegistration["nproductcode"] = -1
        sampleRegistration["nmaterialcatcode"] = -1
        sampleRegistration["nmaterialcode"] = -1
        sampleRegistration["nmaterialinventorycode"] = -1
    }
    else if (masterData.RealSampleTypeValue.nsampletypecode === SampleType.MATERIAL) {
        sampleRegistration["nmaterialcatcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material Category')]['label']].value : -1;
        sampleRegistration["nmaterialcode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']] ?
            selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'Material')]['label']].value : -1;
        sampleRegistration["nmaterialinventorycode"] = selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'materialinventory')]['label']] ?
        selectedRecord[comboComponents[comboComponents.findIndex(x => x.name === 'materialinventory')]['label']].value : -1;
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
        sampleRegistration["nmaterialinventorycode"] = -1
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
        sampleRegistration["nmaterialinventorycode"] = -1
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
    sampleRegistration["jsondata"]['SchedulerSite']= (selectedRecord['SchedulerSite'] && {
        'label':selectedRecord['SchedulerSite'].label,
        'value':selectedRecord['SchedulerSite'].value,
        'source':'site',
        'nsitecode':selectedRecord['SchedulerSite'].value,
        'pkey':'nsitecode'
    })||''

    sampleRegistration["jsondata"]['SchedulerMaster']= (selectedRecord['SchedulerMaster'] && {
        'label':selectedRecord['SchedulerMaster']&&selectedRecord['SchedulerMaster'].label ||'NA',
        'value':selectedRecord['SchedulerMaster'] && selectedRecord['SchedulerMaster'].value || -1,
        'source':'schedulemaster',
        'nschedulecode':selectedRecord['SchedulerMaster'] && selectedRecord['SchedulerMaster'].value || -1,
        'pkey':'nschedulecode'
    })||''

    sampleRegistration["jsonuidata"]['SchedulerSite']=(selectedRecord['SchedulerSite'] &&  selectedRecord['SchedulerSite'].label )||''
    sampleRegistration["jsonuidata"]['SchedulerMaster']=(selectedRecord['SchedulerMaster'] &&  selectedRecord['SchedulerMaster'].label )||'NA';
    const param = { sampleRegistration, dateList }
    return param;
}