import React from "react";
import { Link } from "react-router-dom";
import { Tooltip, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import "../styles/custom.css";

const ButtonCustom = ({
  action = "",
  icon = EyeOutlined,
  tooltipTitle = "ToolTip",
  buttonType = "primary",
  buttonShape = "circle",
  buttonClassName,
  onClick,
  danger,
  view,
  buttonBg,
  disabled,
}) => {
  const backgroundColor = danger ? "rgb(200 46 49)" : buttonBg;

  return (
    <Link to={action}>
      <Tooltip title={tooltipTitle}>
        <Button
          type={buttonType}
          danger={danger}
          view={view}
          shape={buttonShape}
          icon={icon}
          className={`${buttonClassName} ${
            buttonType === "danger"
              ? "custom-danger-button"
              : buttonType === "view"
              ? "custom-view-button"
              : buttonType === "success"
              ? "custom-success-button"
              : ""
          }`}
          onClick={onClick}
          disabled={disabled}
        />
      </Tooltip>
    </Link>
  );
};

export default ButtonCustom;
