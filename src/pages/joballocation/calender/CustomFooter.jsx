import * as React from "react";
import { SchedulerFooter } from "@progress/kendo-react-scheduler";
import {
    ToolbarItem,
    ToolbarSeparator,
    ToolbarSpacer,
} from "@progress/kendo-react-buttons";
import { ToolbarDropdown } from "./toolbar-dropdown";
import { injectIntl } from 'react-intl';

const CustomFooter = (props) => {

    const handleDivisionChange = (event) => {
        props.setSlotDivision(event.target.value);
    }

    const handleDurationChange = (event) => {
        props.setSlotDuration(event.target.value);
    }


    return (
        <SchedulerFooter>

            {props.children}
            {props.view !== "month" && props.view !== "agenda" ? <>
                <ToolbarSpacer />
                <ToolbarItem>
                    {props.footerShowSlotDivision ?
                        <ToolbarDropdown
                            text={props.intl.formatMessage({ id: "IDS_SLOTDIVISION" })}
                            value={props.slotDivisions}
                            data={props.slotDivisionList}
                            className={"k-toolbar-dropdown"}
                            popupSettings={{
                                popupClass: "k-toolbar-popup",
                            }}
                            onChange={handleDivisionChange}
                        /> : ""}
                </ToolbarItem>
                <ToolbarSeparator />
                <ToolbarItem>
                    {props.footerShowSlotDuration ?
                        <ToolbarDropdown
                            text={props.intl.formatMessage({ id: "IDS_SLOTDURIVATION" })}
                            value={props.slotDuration}
                            data={props.slotDurivationList}
                            className={"k-toolbar-dropdown"}
                            popupSettings={{
                                popupClass: "k-toolbar-popup",
                            }}
                            onChange={handleDurationChange}
                        /> : ""}
                </ToolbarItem>
            </> : ""}

        </SchedulerFooter>
    );
};
export default injectIntl(CustomFooter);