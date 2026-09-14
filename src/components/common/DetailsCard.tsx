import { Box, Card, CardContent, Divider, Typography } from "@mui/material";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export interface DetailItem {
  label: string;
  value?: string | number | null;
  icon: IconSvgElement;
}

interface DetailsCardProps {
  title: string;
  items: DetailItem[];
}

const DetailsCard = ({ title, items }: DetailsCardProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #ECEEF3",
        borderRadius: "14px",
        backgroundColor: "#FFFFFF",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 2.2,
          "&:last-child": {
            pb: 2.2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#292D38",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#5965E8",
            }}
          />
        </Box>

        <Divider
          sx={{
            borderColor: "#F0F1F5",
            mb: 0.3,
          }}
        />

        {items.map((item, index) => (
          <Box key={item.label}>
            <Box
              sx={{
                minHeight: 52,
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "9px",
                  backgroundColor: "#F5F5FF",
                  color: "#5965E8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <HugeiconsIcon icon={item.icon} size={16} />
              </Box>

              <Box
                sx={{
                  width: 115,
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    color: "#999DA8",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>

              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#454A57",
                  wordBreak: "break-word",
                  textAlign: "right",
                }}
              >
                {item.value ?? "Not available"}
              </Typography>
            </Box>

            {index < items.length - 1 && (
              <Divider
                sx={{
                  borderColor: "#F5F6F8",
                }}
              />
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
