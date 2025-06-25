import {
    designProperties
} from "../../components/Enumeration";


const designPropertyValue = designProperties.VALUE;
//const designPropertyLabel = designProperties.LABEL;

export const testSubFields = [{
        [designProperties.VALUE]: "stestsynonym",
        [designProperties.LABEL]: "Test Name"
    },
    {
        [designProperties.VALUE]: "ssectionname",
        [designProperties.LABEL]: "Section Name"
    }
];
export const rulesEngineMoreFields = [ 
    // {
    //     [designPropertyValue]: "stransdisplaystatus",
    //     [designProperties.LABEL]: "IDS_TRANSACTIONSTATUS"
     {
        [designPropertyValue]: "nruleexecorder",
        [designProperties.LABEL]: "IDS_SORTORDER"
    } 
    // {
    //     [designPropertyValue]: "stransdisplaystatus",
    //     [designProperties.LABEL]: "IDS_TRANSACTIONSTATUS"
    // } 
    // {
    //     [designPropertyValue]: "stransdisplaystatus",
    //     [designProperties.LABEL]: "IDS_TRANSACTIONSTATUS"
    // } 
];
export const rulesEngineSubFields = [
    {
        [designPropertyValue]: "stransdisplaystatus",
        [designProperties.LABEL]: "IDS_DISPLAYSTATUS"
    } 
    , {
        [designPropertyValue]: "nruleexecorder",
        [designProperties.LABEL]: "IDS_SORTORDER"
    } 
];
export const testMoreFields = [
    // {
    //     [designPropertyValue]: "ssourcename",
    //     [designPropertyLabel]: "IDS_SOURCE"
    // },
    {
        [designPropertyValue]: "smethodname",
        [designProperties.LABEL]: "IDS_METHOD"
    },
    {
        [designPropertyValue]: "sinstrumentcatname",
        [designProperties.LABEL]: "IDS_INSTRUMENTCATEGORY"
    },
    {
        [designPropertyValue]: "scontainertype",
        [designProperties.LABEL]: "IDS_CONTAINERTYPE"
    },
    {
        [designPropertyValue]: "stestpackagename",
        [designProperties.LABEL]: "IDS_TESTPACKAGE"
    },
    {
        [designPropertyValue]: "sfilename",
        [designProperties.LABEL]: "IDS_FILENAME"
    },
    {
        [designPropertyValue]: "ncost",
        [designProperties.LABEL]: "IDS_PRICE"
    },
    {
        [designPropertyValue]: "nsorter",
        [designProperties.LABEL]: "IDS_SORTER"
    },
    {
        [designPropertyValue]: "steststatus",
        [designProperties.LABEL]: "IDS_STATUS"
    },
    {
        [designPropertyValue]: "nrepeatcountno",
        [designProperties.LABEL]: "IDS_REPLICATECOUNT"
    }
];

export const searchFieldList = ["stestsynonym", "ssectionname", "smethodname", "sinstrumentcatname", "ssourcename",
    "ncost", "nsorter","stestpackagename"
];

export const specificationColumnList = [{
        "idsName": "IDS_SPECNAME",
        "dataField": "sspecname",
        "mandatory": true
    },
    {
        "idsName": "IDS_EXPIRYDATE",
        "dataField": "dexpirydate",
        "mandatory": true
    },
    {
        "idsName": "IDS_TIMEZONE",
        "dataField": "ntzexpirydate",
        "mandatory": true
    }
]

//ALPD-4944, Added specificationCopyColumnList to check mandatory fields for copy spec in testgroup screen
//ALPD-4962 Test group screen -> while copy the spec and in spec name field without giving anything & save it blank page occurs.
export const specificationCopyColumnList = [{
    "idsName": "IDS_SPECNAME",
    "dataField": "scopyspecname",
    "mandatory": true
},
{
    "idsName": "IDS_EXPIRYDATE",
    "dataField": "dexpirydate",
    "mandatory": true
},
{
    "idsName": "IDS_TIMEZONE",
    "dataField": "ntzexpirydate",
    "mandatory": true
}
]

export const editTestColumnList = [{
        "idsName": "IDS_TESTSYNONYM",
        "dataField": "stestsynonym",
        "mandatory": true
    },
    // {
    //     "idsName": "IDS_SOURCE",
    //     "dataField": "nsourcecode",
    //     "mandatory": true
    // },
    {
        "idsName": "IDS_SECTION",
        "dataField": "nsectioncode",
        "mandatory": true
    }
]

export const addTestColumnList = [{
        "idsName": "IDS_TESTCATEGORY",
        "dataField": "ntestcategorycode",
        "mandatory": false
    },
    {
        "idsName": "IDS_TEST",
        "dataField": "ntestcode",
        "mandatoryLabel": "IDS_SELECT",
        "mandatory": true
    }
]