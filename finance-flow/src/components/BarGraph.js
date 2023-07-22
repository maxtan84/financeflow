'use client'
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarGraph = ({ data }) => {
  return <Bar data={data}/>;
};

export default BarGraph;