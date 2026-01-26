import { useState } from "react";
import { Stack } from "@mui/material";
import { Screen } from "../../components/Screen";
import { Header } from "./components/Header";
import { VmsCardsList } from "./components/VmsCardsList";
import { useZTheme } from "../../stores/useZTheme";
import { shadow } from "../../utils/shadow";
import { useCloseMenuTimed } from "../../hooks/useCloseMenuTimed";
import { MainGraphic } from "./components/Graphics/MainGraphic";
import { TopGraphic } from "./components/Graphics/TopGraphic";
import { BottomGraphic } from "./components/Graphics/BottomGraphic";
import { ExpandButton } from "../../components/Buttons/ExpandButton";
import { ModalChart } from "./components/Graphics/ModalChart";
import { Sidebar } from "../../components/Sidebar";
import { useZGlobalVar } from "../../stores/useZGlobalVar";
import { WelcomeCards } from "./components/WelcomeCards";
import { useListVms } from "../../hooks/useListVms";

export const HomePage = () => {
  const { theme, mode } = useZTheme();
  useCloseMenuTimed();
  const { totalCountVMs } = useZGlobalVar();
  const [selectedChart, setSelectedChart] = useState<
    "main" | "top" | "bottom" | null
  >(null);

  const { vmList, isLoading } = useListVms();
  console.log(vmList);
  
  const showDashboard = isLoading || (vmList && vmList.length > 0);

  return (
    <Screen
      sx={{
        backgroundColor: theme[mode].light,
        "@media (max-width: 865px)": {
          backgroundColor: theme[mode].light,
        },
      }}
    >
      <Stack
        flexDirection={"row"}
        className="h-full"
        sx={{
          width: "100%",
          backgroundColor: theme[mode].light,
        }}
      >
        <Sidebar />
        <Stack
          width={"100%"}
          sx={{
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          <Header />
          <Stack
            width={"100%"}
            className=""
            flexDirection={"row"}
            sx={{
              justifyContent: "flex-start",
              "@media (max-width: 744px)": {
                flexDirection: "column",
              },
            }}
          >
            {!showDashboard ? (
              <WelcomeCards />
            ) : (
              <Stack
                className="h-full"
                sx={{
                  width: "100%",
                  height: "100%",
                  gap: "16px",
                }}
              >
                <>
                  <VmsCardsList vmList={vmList} isLoading={isLoading} />

                  <Stack
                    sx={{
                      height: "100%",
                      minHeight: "300px",
                      flexDirection: "row",
                      gap: "12px",
                      padding: "0px 32px",
                      paddingBottom: "8px",
                      display: totalCountVMs > 0 ? "flex" : "none",
                      "@media (max-width: 865px)": {
                        flexDirection: "column",
                        maxHeight: "unset",
                      },
                    }}
                  >
                    <Stack
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        width: "50%",
                        height: "100%",
                        borderRadius: "16px",
                        boxShadow: `0px 4px 4px 0px ${shadow(mode)}`,
                        padding: "16px",
                        paddingTop: "24px",
                        backgroundColor: theme[mode].mainBackground,
                        "@media (max-width: 865px)": {
                          flexDirection: "column",
                          width: "100%",
                          minHeight: "325px",
                        },
                      }}
                    >
                      <ExpandButton
                        onClick={() => setSelectedChart("main")}
                      />
                      <MainGraphic />
                    </Stack>
                    <Stack
                      sx={{
                        width: "50%",
                        height: "100%",
                        gap: "12px",
                        "@media (max-width: 865px)": {
                          width: "100%",
                          minHeight: "425px",
                        },
                      }}
                    >
                      <Stack
                        sx={{
                          position: "relative",
                          borderRadius: "16px",
                          boxShadow: `0px 4px 4px 0px ${shadow(mode)}`,
                          height: "100%",
                          backgroundColor: theme[mode].mainBackground,
                          padding: "8px",
                          paddingTop: "16px",
                        }}
                      >
                        <ExpandButton
                          sx={{
                            zIndex: 100,
                          }}
                          onClick={() => setSelectedChart("bottom")}
                        />
                        <BottomGraphic />
                      </Stack>
                    </Stack>
                  </Stack>
                </>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
      {Boolean(selectedChart) && (
        <ModalChart
          open={Boolean(selectedChart)}
          onClose={() => setSelectedChart(null)}
        >
          {selectedChart === "main" && <MainGraphic />}
          {selectedChart === "top" && <TopGraphic />}
          {selectedChart === "bottom" && <BottomGraphic />}
        </ModalChart>
      )}
    </Screen>
  );
};