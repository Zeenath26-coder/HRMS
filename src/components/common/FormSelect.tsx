import { useMemo, useState } from "react";

import {
  Box,
  ClickAwayListener,
  FormHelperText,
  IconButton,
  Paper,
  Popper,
  Typography,
} from "@mui/material";

import {
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { COLORS, RADIUS, TYPOGRAPHY } from "../../theme/designToken";

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T, any, T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
}

const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  multiple = false,
  searchable = false,
}: FormSelectProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const open = Boolean(anchorEl);
  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return options;
    }
    const keyword = search.trim().toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(keyword),
    );
  }, [options, search]);

  const handleClose = () => {
    setAnchorEl(null);
    setSearch("");
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValue = field.value;
        const selectedValues: (string | number)[] = multiple
          ? Array.isArray(currentValue)
            ? currentValue
            : []
          : [];
        const selectedOptions = options.filter(
          (option) =>
            multiple &&
            selectedValues.some(
              (value) => String(value) === String(option.value),
            ),
        );

        const selectedOption = !multiple
          ? options.find(
              (option) => String(option.value) === String(currentValue),
            )
          : undefined;

        const displayValue = multiple
          ? selectedOptions.length > 0
            ? selectedOptions.map((option) => option.label).join(", ")
            : ""
          : (selectedOption?.label ?? "");

        const handleSelect = (option: SelectOption) => {
          if (multiple) {
            const exists = selectedValues.some(
              (value) => String(value) === String(option.value),
            );

            const nextValue = exists
              ? selectedValues.filter(
                  (value) => String(value) !== String(option.value),
                )
              : [...selectedValues, option.value];

            field.onChange(nextValue);
            return;
          }

          field.onChange(option.value);
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
            <Box sx={{ width: "100%" }}>
              <Box
                component="button"
                type="button"
                onClick={(event) => {
                  if (open) {
                    handleClose();
                  } else {
                    setAnchorEl(event.currentTarget);
                  }
                }}
                sx={{
                  position: "relative",
                  width: "100%",
                  minHeight: 54,
                  px: 1.7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  border: "1px solid",
                  borderColor: fieldState.error
                    ? "#DC4C64"
                    : open
                      ? COLORS.primary
                      : "#E1E4EC",
                  borderRadius: "12px",
                  backgroundColor: COLORS.white,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: TYPOGRAPHY.fontFamily,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: open
                    ? "0 0 0 3px rgba(91, 92, 235, 0.08)"
                    : "none",
                  "&:hover": {
                    borderColor: fieldState.error
                      ? "#DC4C64"
                      : open
                        ? COLORS.primary
                        : "#D2D5DF",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -8,
                    left: 12,
                    px: 0.6,
                    backgroundColor: COLORS.white,
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: TYPOGRAPHY.fontFamily,
                      fontSize: 10.5,
                      lineHeight: 1,
                      color: fieldState.error
                        ? "#DC4C64"
                        : open
                          ? COLORS.primary
                          : "#72788A",
                    }}
                  >
                    {label}
                    {required && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.3,
                          color: "#DC4C64",
                        }}
                      >
                        *
                      </Box>
                    )}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: 12.5,
                    color: displayValue ? COLORS.text : "#9BA0B5",
                  }}
                >
                  {displayValue || `Select ${label.toLowerCase()}`}
                </Typography>

                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={17}
                  color="#7C8292"
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </Box>

              {fieldState.error && (
                <FormHelperText
                  error
                  sx={{
                    mx: 1.5,
                    mt: 0.6,
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: 10.5,
                  }}
                >
                  {fieldState.error.message}
                </FormHelperText>
              )}

              <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                style={{
                  zIndex: 1500,
                  width: anchorEl
                    ? anchorEl.getBoundingClientRect().width
                    : undefined,
                }}
                modifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 6],
                    },
                  },
                  {
                    name: "flip",
                    enabled: false,
                  },
                  {
                    name: "preventOverflow",
                    options: {
                      padding: 8,
                    },
                  },
                ]}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    maxHeight: 330,
                    overflow: "hidden",
                    border: "1px solid #E5E7EF",
                    borderRadius: "12px",
                    backgroundColor: COLORS.white,
                    boxShadow: "0 16px 40px rgba(35, 39, 80, 0.16)",
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
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          px: 1,
                          border: "1px solid #E5E7EF",
                          borderRadius: "9px",
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
                          placeholder={`Search ${label.toLowerCase()}...`}
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
                              width: 24,
                              height: 24,
                              borderRadius: "7px",
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
                      p: 0.7,
                      maxHeight: 270,
                      overflowY: "auto",
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
                          py: 3,
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
                        const isSelected = multiple
                          ? selectedValues.some(
                              (value) => String(value) === String(option.value),
                            )
                          : String(currentValue) === String(option.value);

                        return (
                          <Box
                            key={String(option.value)}
                            component="button"
                            type="button"
                            onClick={() => handleSelect(option)}
                            sx={{
                              width: "100%",
                              minHeight: 38,
                              px: 1.2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              border: "none",
                              borderRadius: "8px",
                              backgroundColor: isSelected
                                ? COLORS.primaryLight
                                : "transparent",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: TYPOGRAPHY.fontFamily,
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
                                fontWeight: isSelected ? 600 : 400,
                                color: isSelected
                                  ? COLORS.primary
                                  : COLORS.text,
                              }}
                            >
                              {option.label}
                            </Typography>

                            {isSelected && (
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
      }}
    />
  );
};

export default FormSelect;
