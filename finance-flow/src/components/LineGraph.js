import { Line } from 'react-chartjs-2';

const LineGraph = ({ data }) => {
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="m-2">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;