import { useState } from "react";

import { IconButton, Menu, MenuItem } from "@mui/material";

import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { COLORS } from "../../theme/designToken";

export interface TableAction {
  label: string;
  icon: any;
  onClick: () => void;
  danger?: boolean;
}

interface TableActionMenuProps {
  actions: TableAction[];
}

const TableActionMenu = ({ actions = [] }: TableActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: TableAction) => {
    handleClose();
    setTimeout(() => action.onClick(), 0);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          width: 32,
          height: 32,
          borderRadius: "9px",
          color: "#8A8F9D",

          "&:hover": {
            backgroundColor: COLORS.primaryLight,
            color: COLORS.primary,
          },
        }}
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 190,
              borderRadius: "14px",
              border: "1px solid #EAEBF0",
              boxShadow: "0 10px 35px rgba(30, 41, 59, 0.10)",

              "& .MuiList-root": {
                p: 0.7,
              },
            },
          },
        }}
      >
        {(actions ?? []).map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => handleAction(action)}
            sx={{
              minHeight: 40,
              gap: 1.2,
              borderRadius: "9px",
              fontFamily: "Poppins, sans-serif",
              fontSize: 11.5,
              color: action.danger ? "#DC4C64" : "#424756",
              "&:hover": {
                backgroundColor: action.danger ? "#FFF1F2" : "#F5F5FF",
                color: action.danger ? "#DC2626" : COLORS.primary,
              },
            }}
          >
            <HugeiconsIcon icon={action.icon} size={17} />

            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TableActionMenu;
