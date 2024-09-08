import React from "react";
//import Icon from '@material-ui/core/Icon';
//import { makeStyles } from '@material-ui/styles';
import { ReactComponent as Logo } from "../../assets/svgIcons/reinstate.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { isUpdateAccessExist } from "../../utils/cookies";

function ReinstateIcon(props) {
  return (
    <Tooltip
      title="Reinstate"
      placement={props?.tooltipPlacement ? props?.tooltipPlacement : "top"}
    >
      <IconButton disabled={!isUpdateAccessExist()}>
        <SvgIcon {...props} component={Logo} viewBox="0 0 600 476.6" />
      </IconButton>
    </Tooltip>
  );
}

export default ReinstateIcon;
