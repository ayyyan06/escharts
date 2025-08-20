import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

// 🔹 Хук для проверки мобилки
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

export const LineChart = () => {
  const [chartData, setChartData] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch("/line_data.json")
      .then((res) => res.json())
      .then((data) => setChartData(data));
  }, []);

  if (!chartData) return <div>Loading...</div>;

  const categories = chartData.categories.map((c) => c.ru);

  const seriesList = chartData.series.map((serie) => ({
    name: serie.name.ru,
    type: "line",
    smooth: true,
    showSymbol: true,
    symbol: "circle",
    symbolSize: isMobile ? 6 : 8,
    lineStyle: {
      width: isMobile ? 2 : 3,
      color: serie.color,
    },
    itemStyle: {
      color: serie.color,
      borderColor: "#fff",
      borderWidth: 2,
    },
    label: {
      show: !isMobile, // ❌ на мобилке убираем подписи над точками
      position: "top",
      fontSize: isMobile ? 10 : 12,
      color: serie.color,
      formatter: (p) => (p.value != null ? p.value.toLocaleString() : ""),
    },
    connectNulls: false,
    data: serie.data.map((d) => (d && d.value !== null ? d.value : null)),
    areaStyle: {
      opacity: 0.08,
      color: serie.color,
    },
    emphasis: { focus: "series" },
  }));

  const option = {
    backgroundColor: "transparent",
    animationDuration: 1200,
    title: {
      text: chartData.name.ru,
      left: "center",
      top: isMobile ? 0 : 10,
      textStyle: {
        fontSize: isMobile ? 16 : 22,
        fontWeight: "600",
        color: "#fff",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(40,40,40,0.9)",
      borderRadius: 8,
      padding: 10,
      textStyle: {
        fontSize: isMobile ? 12 : 14,
        color: "#fff",
      },
      axisPointer: {
        type: "line",
        lineStyle: { color: "#aaa", type: "dashed" },
      },
      valueFormatter: (value) => (value != null ? value.toLocaleString() : "-"),
      confine: true, // ✅ чтобы тултип не вылазил за экран
    },
    legend: {
      top: isMobile ? 30 : 50,
      orient: isMobile ? "horizontal" : "horizontal",
      type: "scroll",
      textStyle: {
        color: "#000000ff",
        fontSize: isMobile ? 10 : 13,
      },
    },
    grid: {
      top: isMobile ? 70 : 100,
      left: isMobile ? "10%" : "5%",
      right: isMobile ? "10%" : "5%",
      bottom: isMobile ? "20%" : "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: "#aaa" } },
      axisTick: { show: false },
      axisLabel: {
        color: "#000000ff",
        fontSize: isMobile ? 10 : 13,
        rotate: isMobile ? 40 : 0, // 📱 поворот подписей на мобилке
      },
    },
    yAxis: {
      type: "value",
      name: isMobile ? "" : "Объем (млн)", // 📱 на мобилке убираем подпись оси
      nameTextStyle: {
        color: "#fff",
        fontSize: isMobile ? 10 : 14,
        padding: [0, 0, 10, 0],
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#000000ff",
        fontSize: isMobile ? 10 : 13,
      },
      splitLine: {
        lineStyle: { type: "dashed", color: "#555" },
      },
    },
    series: seriesList,
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: isMobile ? "40vh" : "550px",
        width: "100%",
      }}
    />
  );
};
