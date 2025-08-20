import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "./About.css";

// 🔹 хук для мобильной проверки
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

export const About = () => {
  const chartRef = useRef(null);
  const [option, setOption] = useState(null);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);
  const [btn, setBtn] = useState("map");
  const isMobile = useIsMobile(); // ✅ теперь адаптивно

  const baseTooltip = {
    trigger: "item",
    backgroundColor: "rgba(50, 50, 50, 0.8)",
    borderRadius: 8,
    textStyle: { fontSize: 14, color: "#fff" },
    confine: true,
  };

  // Загружаем geojson + данные
  useEffect(() => {
    fetch("/kazakhstan_map.json")
      .then((res) => res.json())
      .then((geoJson) => {
        echarts.registerMap("kyzylorda", geoJson);
        setGeoJsonLoaded(true);

        fetch("/data_kzmap.json")
          .then((res) => res.json())
          .then((json) => {
            const cats = json.categories.map((c) => c.kk || c.ru || c.en);
            const values = json.series[0].data.map((d) => ({
              name: cats.find((_, i) => json.categories[i].code === d.region),
              value: d.value,
            }));
            setCategories(cats);
            setData(values);
          });
      });
  }, []);

  // ===== Map =====
  const getMapOption = () => ({
    title: { text: "Qazaqstan", left: "center" },
    tooltip: {
      trigger: "item",
      formatter: (params) => `${params.name}: ${params.value}`,
      ...baseTooltip,
    },
    series: [
      {
        id: "kyzylordaMap",
        type: "map",
        map: "kyzylorda",
        roam: true,
        zoom: isMobile ? 3 : 3,
        center: [66.5, 47.9],
        animationDurationUpdate: 1000,
        universalTransition: false,
        visualMap: {
          min: Math.min(...data.map((v) => v.value)),
          max: Math.max(...data.map((v) => v.value)),
          left: "left",
          bottom: 20,
          text: ["Высокое", "Низкое"],
          inRange: { color: ["#006edd"] },
        },
        label: {
          show: isMobile === true ? false : true, // ❌ скрываем текст на мобилке
          fontSize: 10,
          color: "white",
        },
        itemStyle: {
          borderColor: "white",
          areaColor: "#1f4fae",
        },
        emphasis: {
          label: { show: true, fontWeight: "bold", color: "white" },
          itemStyle: { areaColor: "#4b62e4ff" },
        },
        select: {
          disabled: true,
          itemStyle: { areaColor: "#1f4fae" },
        },
        data,
      },
    ],
  });

  // ===== Bar =====
  const getBarOption = (universal = true) => ({
    animationDurationUpdate: 1000,
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        rotate: isMobile ? 60 : 30,
        fontSize: isMobile ? 7 : 12, // ⬅️ уменьшаем ещё
      },
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
        universalTransition: universal,
        itemStyle: { color: "#1f4fae" },
        label: {
          show: !isMobile,
          position: "top",
          formatter: "{c}",
          fontSize: 12,
          color: "#000",
        },
      },
    ],
  });

  // ===== Line =====
  const getLineOption = (universal = true) => ({
    animationDurationUpdate: 1000,
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        rotate: isMobile ? 60 : 30,
        fontSize: isMobile ? 7 : 12, // ⬅️ уменьшаем ещё
      },
    },
    yAxis: { type: "value" },
    tooltip: baseTooltip,
    series: [
      {
        id: "kyzylordaMap",
        smooth: true,
        type: "line",
        data: data.map((d) => d.value),
        universalTransition: universal,
        lineStyle: { width: isMobile ? 3 : 5 },
        itemStyle: { color: "#1f4fae" },
        symbolSize: isMobile ? 10 : 18,
      },
    ],
  });

  // ===== Pie =====
  const getPieOption = (universal = true) => ({
    tooltip: baseTooltip,
    legend: isMobile
      ? {
          orient: "horizontal",
          bottom: 0,
          left: "center",
          type: "scroll",
          textStyle: { fontSize: 10 },
        }
      : {
          orient: "vertical",
          left: "left",
          top: "middle",
          type: "scroll",
          textStyle: { fontSize: 14 },
        },
    series: [
      {
        id: "kyzylordaMap",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        label: isMobile
          ? { show: false } // ❌ убираем подписи
          : {
              show: true,
              position: "outside",
              formatter: "{b}\n{d}%",
              fontSize: 12,
            },
        labelLine: isMobile
          ? { show: false }
          : { show: true, length: 15, length2: 10 },
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        universalTransition: universal,
        data,
      },
    ],
  });

  // ===== переключение кнопками =====
  const prevBtnRef = useRef(null);
  useEffect(() => {
    if (!geoJsonLoaded || data.length === 0) return;
    let universal = true;
    if (prevBtnRef.current === "map" && btn !== "map") universal = false;
    prevBtnRef.current = btn;

    if (btn === "map") setOption(getMapOption());
    else if (btn === "bar") setOption(getBarOption(universal));
    else if (btn === "line") setOption(getLineOption(universal));
    else setOption(getPieOption(universal));
  }, [geoJsonLoaded, data, btn, isMobile]);

  return (
    <div className="about-container">
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
          className="echart-container"
          style={{ height: isMobile ? "40vh" : "90vh", width: "100%" }}
        />
      ) : (
        "Загрузка..."
      )}
    </div>
  );
};
