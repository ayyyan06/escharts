import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

// 🔹 хук для проверки мобилки
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    console.log();
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

export const PieChart = () => {
  const [chartData, setChartData] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch("/pie_data.json")
      .then((res) => res.json())
      .then((data) => setChartData(data));
  }, []);

  if (!chartData) return <div>Loading...</div>;

  // 🔹 категории для подписей
  const categories = chartData.categories.map((c) => c.ru);

  // 🔹 данные для pie
  const serie = chartData.series[0];
  const pieData = serie.data.map((d, i) => ({
    name: categories[i],
    value: d.value,
    itemStyle: { color: d.color },
  }));

  const option = {
    backgroundColor: "transparent",
    // title: {
    //   text: chartData.name.ru,
    //   left: "center",
    //   top: 10,
    //   textStyle: {
    //     fontSize: isMobile ? 16 : 22,
    //     fontWeight: "600",
    //     color: "#000",
    //   },
    // },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(40,40,40,0.9)",
      borderRadius: 8,
      padding: isMobile ? 7 : 10,
      textStyle: {
        fontSize: isMobile ? 10 : 13,
        color: "#fff",
      },
      formatter: (p) => `${p.name}: ${p.value} (${p.percent}%)`,
    },
    legend: isMobile
      ? {
          orient: "horizontal",
          bottom: 0,
          left: "center",
          type: "scroll",
          textStyle: { fontSize: 10, color: "#000" },
        }
      : {
          orient: "vertical",
          left: "left",
          top: "middle",
          type: "scroll",
          textStyle: { fontSize: 13, color: "#000" },
        },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "55%"],
        avoidLabelOverlap: true,
        label: isMobile
          ? { show: false } // ❌ убираем подписи на мобилке
          : {
              show: true,
              formatter: "{b}\n{d}%",
              fontSize: 12,
              color: "#000",
            },
        labelLine: isMobile
          ? { show: false }
          : { show: true, length: 15, length2: 10 },
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        data: pieData,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: isMobile ? "45vh" : "70vh",
        width: "100vw",
      }}
    />
  );
};
