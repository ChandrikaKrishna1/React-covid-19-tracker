import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  if (casesType === "cases") {
    return (
      <div className={props.className}>
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  borderColor: "#CC1034",
                  backgroundColor: "rgba(204, 16,52, 0.5",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    );
  } else if (casesType === "recovered") {
    return (
      <div className={props.className}>
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  borderColor: "#7dd71d",
                  backgroundColor: "rgba(125, 215, 29, 0.5",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    );
  } else {
    {
      return (
        <div className={props.className}>
          {data?.length > 0 && (
            <Line
              data={{
                datasets: [
                  {
                    borderColor: "#fb4443",
                    backgroundColor: "rgba(251, 68, 67, 0.5",
                    data: data,
                  },
                ],
              }}
              options={options}
            />
          )}
        </div>
      );
    }
  }
}

export default LineGraph;
