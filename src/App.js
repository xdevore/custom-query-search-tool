import './App.css'
import Header from './components/Header.js'
import 'semantic-ui-css/semantic.min.css'
import { Form, Grid, Container, Segment, Dropdown, Button, Input, Table } from 'semantic-ui-react'
import { restaurantIdOptions, hours, compareTypeValues } from './Utility'
import React, {useEffect, useState} from "react"
import { ReactDatez } from 'react-datez'
import 'react-datez/dist/css/react-datez.css'


function CustomQuerySearchTool() {

  const [restaurantIds, setRestaurantIds] = useState([]);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [startHourInput, setStartHourInput] = useState(0);
  const [endHourInput, setEndHourInput] = useState(0);
  const [metricCriteria, setMetricCriteria] = useState([ {metricCode:"", compareType:"", value:0} ]);
  const [initialMetricDefinitions, setInitialMetricDefinitions] = useState([]);

  console.log(restaurantIds);

  function onSubmit(){
    const requestData = {
      restaurantIds: restaurantIds,
      fromDate: startDateInput,
      toDate: endDateInput,
      fromHour: startHourInput, 
      toHour: endHourInput,
      metricCriteria: metricCriteria
    };

    console.log(requestData);
    postData("https://customsearchquerytoolapi.azurewebsites.net/Search/Test", requestData)
  }

    // use map to set up metric definitions
    const metricDefinitions = initialMetricDefinitions.map((m, index) => {
      return {
        key: index,
        text: m.alias,
        value: m.metricCode
      }
    });

  async function getData(url = ""){
    const response = await fetch(url, {
        method: "GET",
        cache: "no-cache"
    })

    return response.json()
  }

  async function postData(url = "", request){
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    })

    return response.json()
  }


  useEffect(() =>{
    getData("https://customsearchquerytoolapi.azurewebsites.net/Search/MetricDefinitions")
        .then(data =>{
            setInitialMetricDefinitions(data);
        })

        .catch(err =>{
            console.log("Error!")
        })
  },  []);

  function updateMetricCriteria(newValue, index, fieldName) {
    const newMetricCriteria = [];
    for (var i = 0; i < metricCriteria.length; i++){
      if (i === index) {
        var updatedValue = metricCriteria[i][fieldName];
        updatedValue = newValue;
        newMetricCriteria.push(updatedValue)
      }
      else {
        newMetricCriteria.push(metricCriteria[i])
      }
    }
    setMetricCriteria(newMetricCriteria)
  }

  return (
      <div className="App">
        <Header className='Header' />
        <Grid className="Grid">
          <Grid.Row>
            <Grid.Column>
              <Container className="Container">
                <Segment className="Segment">
                  <Form onSubmit={(event, data) => onSubmit()}>
                    <Form.Field>
                      <Dropdown
                        options={restaurantIdOptions}
                        multiple
                        selection
                        placeholder="Select Restaurant ID"
                        value={restaurantIds}
                        onChange={(event, data) => setRestaurantIds(data.value)}
                      >
                      </Dropdown>
                    </Form.Field>
                    <Form.Field className="Time-segment">
                      <ReactDatez 
                        name="startDateInput"
                        handleChange={value => {
                          setStartDateInput(value);
                        }}
                        value={startDateInput}
                        allowPast = {true}
                        allowFuture = {false}
                      />
                        <ReactDatez 
                        name="endDateInput"
                        handleChange={value => {
                          setEndDateInput(value);
                        }}
                        value={endDateInput}
                        startDate={startDateInput}
                        allowPast = {true}
                        allowFuture = {false}
                        endDate={"01/25/2024"}
                      />
                    </Form.Field>
                    <Form.Field> 
                      <Dropdown
                        options={hours}
                        selection
                        placeholder="Select Starting Hour"
                        value={startHourInput}
                        onChange={(event, data) => setStartHourInput(data.value)}
                      >
                      </Dropdown>
                      <Dropdown
                        options={hours}
                        selection
                        placeholder="Select Ending Hour"
                        value={endHourInput}
                        onChange={(event, data) => setEndHourInput(data.value)}
                      >
                      </Dropdown>
                    </Form.Field>
                    {metricCriteria.map((c, index) => {
                        return (
                        <Form.Field>
                          <Dropdown
                              options={metricDefinitions}
                              selection
                              placeholder="Select Metric"
                              value={c.metricCode}
                              onChange={(event, data) => updateMetricCriteria(data.value, index, "metricCode")}
                            >
                            </Dropdown>
                            <Dropdown
                              options={compareTypeValues}
                              selection
                              placeholder="Select Compare Type"
                              value={c.compareType}
                              onChange={(event, data) => updateMetricCriteria(data.value, index, "compareType")}
                            >
                            </Dropdown>
                            <Input
                              placeholder="Enter Comparison Value"
                              value={c.value}
                              onChange={(event, data) => updateMetricCriteria(data.value, index, "value")}
                            >
                            </Input>
                            <Button type="button" onClick={(event, data) => {
                              const newMetricCriteria = [];
                              for (var i = 0; i < metricCriteria.length - 1; i++){
                                  newMetricCriteria.push(metricCriteria[i])
                              }
                              setMetricCriteria(newMetricCriteria)
                            }}>Delete Criteria</Button>
                      </Form.Field>)
                    })}
                  <Form.Field>
                      <Button type="button" onClick={(event, data) => {
                          const newMetricCriteria = [];
                          for (var i = 0; i < metricCriteria.length; i++){
                              newMetricCriteria.push(metricCriteria[i])
                          }
                          newMetricCriteria.push( {metricCode:"", compareType:"", value:0} );
                          setMetricCriteria(newMetricCriteria)
                      }}>Add Criteria</Button>
                  </Form.Field>
                    <Form.Field>
                      <Button type="submit">
                        Submit!
                      </Button>
                    </Form.Field>
                  </Form>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table className="Grid-second-row" color="blue">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Restaurant Id</Table.HeaderCell>
                    <Table.HeaderCell>Transaction Date</Table.HeaderCell>
                    <Table.HeaderCell>Transaction Time</Table.HeaderCell>
                    <Table.HeaderCell>Ticket Number</Table.HeaderCell>
                    {metricDefinitions.map(item => 
                      <Table.HeaderCell>{item.value}</Table.HeaderCell>
                    )}
                  </Table.Row>
                </Table.Header>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
  );
}

export default CustomQuerySearchTool;
