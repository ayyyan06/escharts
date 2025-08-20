import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "./map.css";

const KyzylordaChart = () => {
  const chartRef = useRef(null);
  const [option, setOption] = useState(null);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);
  const [btn, setBtn] = useState("map");
  const baseTooltip = {
    trigger: "item",
    backgroundColor: "rgba(50, 50, 50, 0.8)",
    borderRadius: 8,
    textStyle: { fontSize: 14, color: "#fff" },
  };

  // Загружаем geojson
  useEffect(() => {
    fetch("/kyzylordaGeoJSON.json")
      .then((res) => res.json())
      .then((geoJson) => {
        echarts.registerMap("kyzylorda", geoJson);
        setGeoJsonLoaded(true);

        fetch("/data.json")
          .then((res) => res.json())
          .then((json) => {
            const cats = json.categories.map((c) => c.ru || c.kz || c.en);
            const values = json.series[0].data.map((d) => ({
              name: cats.find((_, i) => json.categories[i].code === d.region),
              value: d.value,
            }));

            setCategories(cats);
            setData(values);
          });
      });
  }, []);

  const getMapOption = () => ({
    title: { text: "Qyzylorda", left: "center" },
    tooltip: {
      trigger: "item",
      formatter: (params) => `${params.name}: ${params.value}`,
      backgroundColor: "rgba(50,50,50,0.8)",
      borderRadius: 8,
      textStyle: { color: "#fff" },
    },
    series: [
      {
        id: "kyzylordaMap",
        type: "map",
        map: "kyzylorda",
        roam: true,
        zoom: 8,
        center: [63.5, 44.9],
        animationDurationUpdate: 1000,
        universalTransition: true,
        label: {
          show: true,
          fontSize: 10,
          lineHeight: 14,
          color: "white",
        },
        itemStyle: {
          borderColor: "white",
          areaColor: "#1f4fae",
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: "bold",
            color: "white",
          },
          itemStyle: {
            areaColor: "#4b62e4ff",
          },
        },
        select: {
          disabled: true,
          itemStyle: { areaColor: "#1f4fae" },
        },
        data,
      },
    ],
  });

  const getBarOption = () => ({
    animationDurationUpdate: 1000,
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: "value" },
    tooltip: {
      ...baseTooltip,
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) => `${p[0].axisValue}: ${p[0].data}`,
    },
    series: [
      {
        id: "kyzylordaMap",
        type: "bar",
        data: data.map((d) => d.value),
        universalTransition: true,
        itemStyle: { color: "#1f4fae" },
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          fontSize: 12,
          color: "#000",
        },
      },
    ],
  });

  const getLineOption = () => ({
    animationDurationUpdate: 1000,
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value" },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      borderRadius: 8,
      textStyle: { fontSize: 14, color: "#fff" },
    },
    series: [
      {
        id: "kyzylordaMap",
        smooth: true,
        type: "line",
        data: data.map((d) => d.value),
        universalTransition: true,
        lineStyle: {
          width: 5,
          shadowColor: "rgba(0, 0, 0, 0.2)",
          shadowBlur: 10,
        },
        itemStyle: {
          color: "#1f4fae",
          borderWidth: 2,
        },
        symbolSize: 18,
      },
    ],
  });

  const getPieOption = () => {
    const isMobile = window.innerWidth < 768; // ✅ ширина < 768px = телефон

    return {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
        backgroundColor: "rgba(50, 50, 50, 0.8)",
        borderRadius: 8,
        textStyle: { color: "#fff" },
      },
      legend: {
        type: "scroll",
        orient: "horizontal",
        bottom: 0,
        left: "center",
        textStyle: { fontSize: isMobile ? 10 : 14 }, // меньше текст на мобилке
      },
      series: [
        {
          id: "kyzylordaMap",
          type: "pie",
          radius: isMobile ? ["45%", "70%"] : ["40%", "65%"], // побольше центр на мобилке
          center: ["50%", isMobile ? "40%" : "45%"],
          avoidLabelOverlap: true,
          label: {
            show: !isMobile, // ❌ скрыть подписи на мобилке
            position: "outside",
            formatter: "{b}\n{d}%",
            fontSize: 12,
          },
          labelLine: {
            show: !isMobile, // ❌ убрать линии на мобилке
            length: 15,
            length2: 10,
          },
          itemStyle: {
            borderRadius: 6,
            borderColor: "#fff",
            borderWidth: 2,
          },
          universalTransition: true,
          data,
        },
      ],
    };
  };

  useEffect(() => {
    if (!geoJsonLoaded || data.length === 0) return;
    if (btn === "map") setOption(getMapOption());
    else if (btn === "bar") setOption(getBarOption());
    else if (btn === "line") setOption(getLineOption());
    else setOption(getPieOption());
  }, [geoJsonLoaded, data, btn]);

  return (
    <div className="chart-container">
      <div className="btns">
        <button onClick={() => setBtn("map")}>map</button>
        <button onClick={() => setBtn("bar")}>bar</button>
        <button onClick={() => setBtn("line")}>line</button>
        <button onClick={() => setBtn("pie")}>pie</button>
      </div>
      {option ? (
        <ReactECharts
          ref={chartRef}
          option={option}
          notMerge={true}
          style={{ width: "100%", height: "60vh" }}
        />
      ) : (
        "Загрузка..."
      )}
    </div>
  );
};

export default KyzylordaChart;
