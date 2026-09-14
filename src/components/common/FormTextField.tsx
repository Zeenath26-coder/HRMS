import { TextField, type TextFieldProps } from "@mui/material";
import { formFieldSx } from "./formStyles";

interface FormTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string;
  error?: boolean;
  helperText?: React.ReactNode;
}

const FormTextField = ({
  name,
  error,
  helperText,
  sx,
  ...props
}: FormTextFieldProps) => {
  return (
    <TextField
      {...props}
      name={name}
      fullWidth
      error={error}
      helperText={helperText}
      sx={{
        ...formFieldSx,
        ...sx,
      }}
    />
  );
};

export default FormTextField;
