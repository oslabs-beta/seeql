import * as React from 'react';
import { Fragment } from 'react';
import { useState, useEffect } from 'react';
import Tables from '../components/Tables';
const mockData = require('../mockData/mockData.json');
// const ipcRenderer = require('electron').ipcRenderer;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [tableToRender, setRender] = useState([]);
  const fetchData = () => mockData;

  //function generates a mock unique ID for React Components
  const generateUniqueKey = () => (Math.random() * 1000).toString();

  useEffect(() => {
    if (data.length > 0) {
      const dataObj = data.map(table => {
        return (
          <Tables
            tableName={table.table_name}
            columns={table.columns}
            key={generateUniqueKey()}
          />
        );
      });
      setRender(dataObj);
    }
  }, [data]);

  return (
    <Fragment>
      <button onClick={() => setData(fetchData)}>Get All Tables</button>
      {tableToRender}
    </Fragment>
  );
};

export default HomePage;
