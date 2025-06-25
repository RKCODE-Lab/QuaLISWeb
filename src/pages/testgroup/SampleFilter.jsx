import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { formCode, transactionStatus, SampleType } from '../../components/Enumeration';

const SampleFilter = (props) => {
    console.log("props:", props);

    const categoryBasedFlow =  props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.ncategorybasedflowrequired == transactionStatus.NO 
    ? props.tempFilterData["nproductcatcode"] && props.tempFilterData["nproductcatcode"].item.ncategorybasedflow === transactionStatus.NO ? true : false : false;

    return (
       
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                    isSearchable={true}
                    name={"nsampletypecode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={false}
                    showOption={true}
                    options={props.sampleType || []}
                    optionId='nsampletypecode'
                    optionValue='ssampletypename'
                    value={props.tempFilterData["nsampletypecode"] ? props.tempFilterData["nsampletypecode"] : ""}
                    onChange={value => props.onFilterComboChange(value, "nsampletypecode", 1)}//, "getProductCategory", "sampletype"
                    sortOrder="ascending"
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id:props.tempFilterData["nsampletypecode"] ? props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nformcode===formCode.PRODUCTCATEGORY?props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]:
                    props.tempFilterData["nsampletypecode"] &&  props.tempFilterData["nsampletypecode"].item.nformcode===formCode.INSTRUMENTCATEGORY?"IDS_INSTRUMENTCATEGORY":
                    props.tempFilterData["nsampletypecode"] &&  props.tempFilterData["nsampletypecode"].item.nformcode===formCode.MATERIALCATEGORY?"IDS_MATERIALCATEGORY":props.genericLabel && props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]:props.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]})}
                    name={"nproductcatcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    optionId={"nproductcatcode"}
                    optionValue={"sproductcatname"}
                    options={props.productCategory || []}
                    showOption={true}
                    value={props.tempFilterData["nproductcatcode"] ? props.tempFilterData["nproductcatcode"] : ""}
                    isSearchable={true}
                    onChange={(event) => props.onFilterComboChange(event, "nproductcatcode", 2)}//, "getProduct", "productcategory"
                    sortOrder="ascending"
                >
                </FormSelectSearch>
            </Col>
            
               { categoryBasedFlow &&
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id:props.tempFilterData["nsampletypecode"] ? props.tempFilterData["nsampletypecode"] &&  props.tempFilterData["nsampletypecode"].item.nformcode===formCode.PRODUCTCATEGORY?props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode] :
                        props.tempFilterData["nsampletypecode"] &&  props.tempFilterData["nsampletypecode"].item.nformcode===formCode.INSTRUMENTCATEGORY?"IDS_INSTRUMENT":
                        props.tempFilterData["nsampletypecode"] &&  props.tempFilterData["nsampletypecode"].item.nformcode===formCode.MATERIALCATEGORY?"IDS_MATERIAL":props.genericLabel && props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]:props.genericLabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]  })}
                        name={"nproductcode"}
                        placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                        optionId={"nproductcode"}
                        optionValue={"sproductname"}
                        options={props.product || []}
                        showOption={true}
                        value={props.tempFilterData["nproductcode"] ? props.tempFilterData["nproductcode"] : ""}
                        isSearchable={true}
                        onChange={(event) => props.onFilterComboChange(event, "nproductcode", 4)}//, "getTreeVersionTemplate", "product"
                        sortOrder="ascending"
                    >
                    </FormSelectSearch>
                </Col>
            }
            { props.tempFilterData["nsampletypecode"] &&  props.tempFilterData["nsampletypecode"].value === SampleType.PROJECTSAMPLETYPE ?
              props.tempFilterData["nsampletypecode"] && props.tempFilterData["nsampletypecode"].item.nprojectspecrequired === transactionStatus.YES ?
                <>  <Col md={12}>
                        <FormSelectSearch
                                formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                                isSearchable={true}
                                name={"nprojecttypecode"}
                                isDisabled={false}
                                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={true}
                                isClearable={false}
                                options={props.projectType}
                                value={props.tempFilterData["nprojecttypecode"] || ""}
                                defaultValue={props.tempFilterData["nprojecttypecode"]}
                                onChange={(event) => props.onFilterComboChange(event, "nprojecttypecode", 6)}
                                closeMenuOnSelect={true}
                            >
                            </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            name={"nprojectmastercode"}
                            formLabel={props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={props.project}
                            value={props.tempFilterData["nprojectmastercode"]}
                            defaultValue={props.tempFilterData["nprojectmastercode"]}
                            isMandatory={true}
                            isSearchable={true}
                            isClearable={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            onChange={(value) => props.onFilterComboChange(value, 'nprojectmastercode', 4)}
                        />
                        
                    </Col>
                </>:"":""
            }
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_TREETEMPLATEVERSION" })}
                    name={"ntreeversiontempcode"}
                    placeholder={props.intl.formatMessage({ id: "IDS_PLEASESELECT" })}
                    optionId={"ntreeversiontempcode"}
                    optionValue={"sversiondescription"}
                    options={props.treeVersionTemplate || []}
                    showOption={true}
                    value={props.tempFilterData["ntreeversiontempcode"] ? props.tempFilterData["ntreeversiontempcode"] : ""}
                    isSearchable={true}
                    onChange={(event) => props.onFilterComboChange(event, "ntreeversiontempcode", 4)}//, "getTreeVersionTemplate", "product"
                    sortOrder="ascending"
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(SampleFilter);