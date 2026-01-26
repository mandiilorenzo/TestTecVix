import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { IFormatData } from "../../../../types/socketType";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";

export const TopGraphic = () => {
  const [chartData, setChartData] = useState<IFormatData[]>([]);
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  useEffect(() => {
    setChartData([{ time: "now", value: 45.8 }]);
  }, []);

  const COLORS = [
    theme[mode].ok,
    theme[mode].grayLight,
    theme[mode].warning,
    theme[mode].grayLight,
    theme[mode].danger,
    theme[mode].grayLight,
  ];

  const MAX_PERCENTAGE = 1;

  const generateGaugeData = (value: number) => {
    if (value < 0.6) {
      return [
        { value },
        { value: MAX_PERCENTAGE * 0.6 - value },
        { value: MAX_PERCENTAGE - MAX_PERCENTAGE * 0.75 },
        { value: 0 },
        { value: MAX_PERCENTAGE - MAX_PERCENTAGE * 0.85 },
      ];
    }

    if (value < 0.85) {
      return [
        { value: 0 },
        { value: 0 },
        { value },
        { value: MAX_PERCENTAGE - MAX_PERCENTAGE * 0.75 - (value - 0.6) },
        { value: MAX_PERCENTAGE - MAX_PERCENTAGE * 0.85 },
      ];
    }

    return [
      { value: 0 },
      { value: 0 },
      { value: 0 },
      { value: 0 },
      { value },
      { value: MAX_PERCENTAGE - value },
    ];
  };

  const usage = (chartData[0]?.value || 0) / 100;
  const valueColor = usage < 0.6 ? theme[mode].ok : usage < 0.85 ? theme[mode].warning : theme[mode].danger;

  return (
    <Stack sx={{ width: "100%", height: "100%", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ paddingLeft: "20px", fontSize: "12px", alignSelf: "flex-start", color: theme[mode].primary }}>
        {`${t("graphics.diskUsage")} - ${vmName || "Selecionar VM"}`}
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={generateGaugeData(usage)}
            startAngle={180}
            endAngle={0}
            innerRadius="85%"
            outerRadius="120%"
            dataKey="value"
            stroke="none"
            cx="50%"
            cy="75%"
          >
            {generateGaugeData(usage).map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
            <Label
              value={`${(usage * 100).toFixed(1)}%`}
              position="center"
              style={{ fill: valueColor, fontSize: "16px", fontWeight: "bold" }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Stack>
  );
};