import * as React from 'react';
import { Fragment } from 'react';
import { useState, useEffect } from 'react';
import Tables from '../components/Tables';
// import { render } from 'react-dom';
const mockData = require('../mockData/mockData.json');
// import { mock, Columns, ForeignKeysEntity } from '../mockData/mockContext';
// import { DataContextProvider } from '../mockData/mockContext';
// const ipcRenderer = require('electron').ipcRenderer;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [renderedData, setRender] = useState([]);

  // // const fetchData = () => ipcRenderer.sendSync('fetch-data');
  const fetchMockData = () => {
    return mockData;
  };
  const generateUnique = () => {
    let random = Math.random() * 100;
    console.log(random);
    return random.toString();
  };

  useEffect(() => {
    const mockRender = data.map(item => {
      if (data.length > 0) {
        return (
          <Tables
            tableName={item.table_name}
            columns={item.columns}
            key={generateUnique()}
          />
        );
      }
    });
    setRender(mockRender);
    console.log('mock', mockRender);
  }, [data]);

  return (
    <Fragment>
      <button
        onClick={() => {
          console.log('clicked');
          setData(fetchMockData);
        }}
      >
        Get All Tables
      </button>
      {renderedData}
    </Fragment>
  );
};

export default HomePage;
