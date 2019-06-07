import * as React from 'react';
import { useState, useEffect } from 'react';
import Tables from '../components/Tables';
const mockData = require('../mockData/mockData');
// const ipcRenderer = require('electron').ipcRenderer;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [renderedData, setRender] = useState([]);

  // const fetchData = () => ipcRenderer.sendSync('fetch-data');
  const fetchMockData = () => {
    return mockData;
  };

  useEffect(() => {
    const mockRender = data.map(item => <Tables />);
    setRender(mockRender);
  }, [data]);

  return (
    <div>
      <button onClick={() => setData(fetchMockData)}>Get All Tables</button>
      {renderedData}
    </div>
  );
};

export default HomePage;
