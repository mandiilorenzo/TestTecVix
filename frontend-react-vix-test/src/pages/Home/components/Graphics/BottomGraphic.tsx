import { useEffect, useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { IFormatData } from "../../../../types/socketType";
import moment from "moment";

export const BottomGraphic = () => {
  const [chartData, setChartData] = useState<IFormatData[]>([]);
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  useEffect(() => {
    const mockData: IFormatData[] = Array.from({ length: 15 }, (_, i) => ({
      time: moment().subtract(15 - i, "minutes").format("HH:mm"),
      value: Math.floor(Math.random() * (85 - 20 + 1) + 20),
    }));
    setChartData(mockData);
  }, []);

  const lastMemoryData = chartData[chartData.length - 1]?.value || 0;
  const valueColor = lastMemoryData < 80 ? theme[mode].ok : theme[mode].danger;

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Typography sx={{ color: theme[mode].primary, fontSize: "12px", fontWeight: "500", marginLeft: "20px" }}>
        {`${t("graphics.memoryUsage")} - ${vmName || "Selecionar VM"}`}{" "}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>{lastMemoryData.toFixed(1)}%</span>
        </span>
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme[mode].gray} />
          <XAxis dataKey="time" tick={{ fill: theme[mode].dark, fontSize: 10 }} />
          <YAxis tick={{ fill: theme[mode].dark, fontSize: 10 }} domain={[0, 100]} />
          <Tooltip formatter={(value) => `${parseFloat(value as string).toFixed(2)}%`} />
          <Legend />
          <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" />
          <Bar dataKey="value" fill={theme[mode].primary} opacity={0.4} barSize={20} />
          <Line type="monotone" dataKey="value" stroke={theme[mode].warning} dot={true} />
        </ComposedChart>
      </ResponsiveContainer>
    </Stack>
  );
};