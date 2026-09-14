import { useMemo, useState } from "react";

import {
  Box,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Typography,
} from "@mui/material";

import {
  CheckmarkCircle02Icon,
  Search01Icon,
  Cancel01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import { COLORS, RADIUS, TYPOGRAPHY } from "../../theme/designToken";

export interface FilterOption {
  value: string | number;
  label: string;
}

interface FilterSelectProps {
  value: string | number;
  options: FilterOption[];
  placeholder?: string;
  onChange: (value: string | number) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  width?: number | string;
}

const FilterSelect = ({
  value,
  options,
  placeholder = "Select",
  onChange,
  searchable = true,
  searchPlaceholder = "Search...",
  width = 160,
}: FilterSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const open = Boolean(anchorEl);
  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );
  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return options;
    }

    const keyword = search.toLowerCase().trim();
    return options.filter((option) =>
      option.label.toLowerCase().includes(keyword),
    );
  }, [options, search]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSearch("");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch("");
  };

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    handleClose();
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open) {
          handleClose();
        }
      }}
    >
      <Box>
        <Box
          component="button"
          type="button"
          onClick={handleOpen}
          sx={{
            width,
            height: 40,
            px: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            border: "1px solid",
            borderColor: open ? COLORS.primary : COLORS.border,
            borderRadius: RADIUS.input,
            backgroundColor: COLORS.white,
            cursor: "pointer",
            fontFamily: TYPOGRAPHY.fontFamily,
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            boxShadow: open ? "0 0 0 3px rgba(91, 92, 235, 0.08)" : "none",

            "&:hover": {
              borderColor: open ? COLORS.primary : "#D5D7F6",
            },
          }}
        >
          <Typography
            sx={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: 11.5,
              fontWeight: 600,

              color: selectedOption ? COLORS.text : "#20234A",
            }}
          >
            {selectedOption?.label ?? placeholder}
          </Typography>

          <HugeiconsIcon icon={ArrowDown01Icon} size={15} color="#7B8190" />
        </Box>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{
            zIndex: 1400,
          }}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 6],
              },
            },
          ]}
        >
          <Paper
            elevation={0}
            sx={{
              width: typeof width === "number" ? Math.max(width, 220) : width,
              maxHeight: 320,
              overflow: "hidden",
              borderRadius: "12px",
              border: "1px solid #E7E8F0",
              backgroundColor: COLORS.white,
              boxShadow: "0 14px 35px rgba(35, 39, 80, 0.14)",
            }}
          >
            
            {searchable && (
              <Box
                sx={{
                  p: 1,
                  borderBottom: "1px solid #ECEEF3",
                }}
              >
                <Box
                  sx={{
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    border: "1px solid #E7E8F0",
                    borderRadius: "8px",
                    backgroundColor: "#FAFAFC",
                    "&:focus-within": {
                      borderColor: COLORS.primary,
                      backgroundColor: COLORS.white,
                    },
                  }}
                >
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={15}
                    color="#9297A5"
                  />

                  <Box
                    component="input"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      ml: 0.8,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontFamily: TYPOGRAPHY.fontFamily,
                      fontSize: 11,
                      color: COLORS.text,
                      "&::placeholder": {
                        color: "#9BA0B5",
                        opacity: 1,
                      },
                    }}
                  />

                  {search && (
                    <IconButton
                      size="small"
                      onClick={() => setSearch("")}
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "6px",
                        color: "#9297A5",

                        "&:hover": {
                          backgroundColor: COLORS.primaryLight,
                          color: COLORS.primary,
                        },
                      }}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={13} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                maxHeight: 255,
                overflowY: "auto",
                p: 0.6,
                "&::-webkit-scrollbar": {
                  width: 5,
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#D9DBE5",
                  borderRadius: 10,
                },
              }}
            >
              {filteredOptions.length === 0 ? (
                <Box
                  sx={{
                    px: 1.5,
                    py: 2.5,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: TYPOGRAPHY.fontFamily,
                      fontSize: 11,
                      color: COLORS.textSecondary,
                    }}
                  >
                    No results found
                  </Typography>
                </Box>
              ) : (
                filteredOptions.map((option) => {
                  const selected = String(option.value) === String(value);

                  return (
                    <Box
                      key={String(option.value)}
                      component="button"
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      sx={{
                        width: "100%",
                        minHeight: 36,
                        px: 1.2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: selected
                          ? COLORS.primaryLight
                          : "transparent",
                        cursor: "pointer",
                        fontFamily: TYPOGRAPHY.fontFamily,
                        textAlign: "left",
                        transition: "background-color 0.15s ease",
                        "&:hover": {
                          backgroundColor: COLORS.primaryLight,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: TYPOGRAPHY.fontFamily,
                          fontSize: 11.5,
                          fontWeight: selected ? 600 : 400,
                          color: selected ? COLORS.primary : COLORS.text,
                        }}
                      >
                        {option.label}
                      </Typography>

                      {selected && (
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={16}
                          color={COLORS.primary}
                        />
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default FilterSelect;
