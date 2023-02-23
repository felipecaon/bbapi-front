import React, { useEffect, useState } from "react";
import './App.css';

function App() {
  const [allData, setData] = useState();

  const getApiData = async () => {
    const headers = { 'X-Key': 'SODFHSUIVSIODCSIAUCSBDCA' }
    // ?start_date=2023-02-22&end_date=2023-02-22
    const response = await fetch('http://62.210.129.122:8000/fqdn/updated', { headers })
      .then((response) => response.json());

    setData(response);
  };
  
  useEffect(() => {
    getApiData();
  }, []);

  const prettyPrintList = (data) => {
    if (data == null){
      return <a>null</a>
    }

    var html_output = []
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      html_output.push(<a>{element}<br/></a>)
    }

    return html_output
  }
  
  const compareData = (currentData, previousData, list) => {

    if (currentData == null || previousData == null){
      return <a>null</a>
    }


    if (list == true){
      var html_outout = []

      for (let index = 0; index < currentData.length; index++) {
        const element = currentData[index];
        if (previousData.includes(element)){
          html_outout.push(<a>{element}<br/></a>)
        } else {
          html_outout.push(<a id="changed-data">{element}<br/></a>)
        }
      }

      return html_outout

    } else {
      if (currentData != previousData){
        return <a id="changed-data">{currentData}</a>
      } else {
        return <a>{currentData}</a>
      }
    }
  }

  const showData = (data) => {
    const OFFSET = 5000

    const current_values = data.current_values
    const previous_values = data.previous_values

    if (current_values.content_length + OFFSET >= previous_values.content_length || current_values.content_length - OFFSET >= previous_values.content_length){
      if (JSON.stringify(current_values.cname) === JSON.stringify(previous_values.cname) &&
        current_values.status_code == previous_values.status_code &&
        current_values.title == previous_values.title) {
          return 
        } else {
          return (
            <tr>
              <td><a href={"https://"+data.fqdn}>{data.fqdn}</a></td>
              <td>
                <b>cname:</b> {compareData(data.current_values.cname, data.previous_values.cname, true)}<br></br>
                <b>status_code:</b> {compareData(data.current_values.status_code, data.previous_values.status_code)}<br></br>
                <b>title:</b> {compareData(data.current_values.title, data.previous_values.title)}<br></br>
              </td>
              <td>
                <b>cname:</b> {JSON.stringify(data.previous_values.cname, null, 2)} <br></br>
                <b>status_code:</b> {data.previous_values.status_code} <br></br>
                <b>title:</b> {data.previous_values.title}<br></br>
              </td>
            </tr>
          )
        }
      } else {
        return (
          <tr>
            <td><a href={"https://"+data.fqdn}>{data.fqdn}</a></td>
            <td>
              <b>cname:</b> {compareData(data.current_values.cname, data.previous_values.cname, true)}<br></br>
              <b>status_code:</b> {compareData(data.current_values.status_code, data.previous_values.status_code)}<br></br>
              <b>title:</b> {compareData(data.current_values.title, data.previous_values.title)}<br></br>
              <b>length:</b>  {compareData(data.current_values.content_length, data.previous_values.content_length)}<br></br>
            </td>
            <td>
              <b>cname:</b> {JSON.stringify(data.previous_values.cname, null, 2)} <br></br>
              <b>status_code:</b> {data.previous_values.status_code} <br></br>
              <b>title:</b> {data.previous_values.title}<br></br>
              <b>length:</b> {data.previous_values.content_length}<br></br>
            </td>
          </tr>
        )
      }
  }

  return (
    <div className="app">
      <table>
        <tbody>
          <tr>
            <td>URL</td>
            <td>Current Values</td>
            <td>Previous Values</td>
          </tr>
          {allData &&
            allData.map((data) => (
              showData(data)
            ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default App;