import * as React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
export const ToolbarDropdown = (props) => {
  const { text, ...other } = props;
  return (
    <DropDownList
      {...other}
      valueRender={(el, value) => (
        <el.type {...el.props}>
          {text}: {value}
        </el.type>
      )}
    />
  );
};