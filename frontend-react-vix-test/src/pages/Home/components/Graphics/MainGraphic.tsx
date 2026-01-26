import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { IFormatData } from "../../../../types/socketType";
import moment from "moment";

export const MainGraphic = () => {
  const [chartData, setChartData] = useState<IFormatData[]>([]);
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  useEffect(() => {
    const mockData: IFormatData[] = Array.from({ length: 20 }, (_, i) => ({
      time: moment().subtract(20 - i, "minutes").format("HH:mm"),
      value: Math.floor(Math.random() * (95 - 5 + 1) + 5), 
    }));
    setChartData(mockData);
  }, []);

  const lastCpuUsage = chartData[chartData.length - 1]?.value || 0;

  const valueColor =
    lastCpuUsage < 70
      ? theme[mode].ok
      : lastCpuUsage < 90
        ? theme[mode].warning
        : theme[mode].danger;

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Typography
        sx={{
          padding: "2px",
          color: theme[mode].primary,
          fontWeight: "500",
          paddingRight: "24px",
        }}
      >
        {`${t("graphics.cpuUsage")} - ${vmName || "Selecionar VM"}`}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {" "}
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>{lastCpuUsage.toFixed(2)}%</span>
        </span>
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme[mode].gray} />
          <XAxis
            dataKey="time"
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
          />
          <YAxis
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            domain={[0, 100]}
          />
          <Tooltip formatter={(value) => `${parseFloat(value as string).toFixed(2)}%`} />
          <Legend />
          <ReferenceLine y={70} stroke="yellow" strokeDasharray="3 3" />
          <ReferenceLine y={90} stroke="red" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="value"
            stroke={theme[mode].primary}
            fill={theme[mode].primary}
            fillOpacity={0.3}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};