import { Avatar } from "@mui/material";
interface UserAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
}

export const UserAvatar = ({ firstName, lastName, size = 36 }: UserAvatarProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontFamily: "Poppins, sans-serif",
        fontSize: size * 0.3,
        fontWeight: 600,
        backgroundColor: "#E9E7FF",
        color: "#5965E8",
      }}
    >
      {initials}
    </Avatar>
  );
};
