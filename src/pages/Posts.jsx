import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export const Posts = () => {
  const [cats, setCats] = useState([]);
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    fetch("/bar_data.json")
      .then((res) => res.json())
      .then((data) => {
        const categories = data.categories.map((c) => c.ru);
        // data.series.map((d) => {
        //   d.data.map((s) => {
        //     console.log(s);
        //   });
        // });
        const series = data.series.map((serie) => ({
          name: serie.index,
          type: "bar",
          barGap: 0,
          label: labelOption,
          emphasis: { focus: "series" },
          data: serie.data.map((d) => (d && d.value != null ? d.value : 0)),
        }));
        setCats(categories);
        setSeriesData(series);
      });
  }, []);

  const labelOption = {
    show: true,
    position: "insideBottom",
    distance: 15,
    align: "left",
    verticalAlign: "middle",
    rotate: 90,
    formatter: "{c}  {name|{a}}",
    fontSize: 16,
    rich: { name: {} },
  };

  const barOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {},
    toolbox: {
      show: true,
      orient: "vertical",
      left: "right",
      top: "center",
      feature: {
        // mark: { show: true },
        // ❌ убрали dataView
        // ❌ убрали line из magicType
        magicType: { show: true, type: ["stack"] },
        saveAsImage: { show: true },
      },
    },
    xAxis: [
      {
        type: "category",
        axisTick: { show: false },
        data: cats,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: seriesData,
  };

  return (
    <ReactECharts option={barOption} style={{ paddingTop: 50, height: 500 }} />
  );
};
