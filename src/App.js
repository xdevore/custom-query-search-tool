import './App.css';
import Header from './components/Header.js';
import 'semantic-ui-css/semantic.min.css';
import { Form, Grid, Container, Segment, Dropdown, Button } from 'semantic-ui-react';
import { restaurantIdOptions } from './Utility';
import React, {useEffect, useState} from "react";
import { ReactDatez, ReduxReactDatez } from 'react-datez';
import 'react-datez/dist/css/react-datez.css';


function CustomQuerySearchTool() {

  const [restaurantIds, setRestaurantIds] = useState([]);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

  console.log(restaurantIds);

  function onSubmit(){
    const requestData = {
      restaurantIds: restaurantIds,
      fromDate: startDateInput,
      toDate: endDateInput
    };

    console.log(requestData);
  }

  return (
      <div className="App">
        <Header />
        <Grid className="Grid">
          <Grid.Row>
            <Grid.Column>
              <Container>
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
                    <Form.Field>
                      <ReactDatez 
                        name="startDateInput"
                        handleChange={value => {
                          setStartDateInput(value);
                        }}
                        value={startDateInput}
                      />
                    </Form.Field>
                    <Form.Field>
                      <ReactDatez 
                        name="endDateInput"
                        handleChange={value => {
                          setEndDateInput(value);
                        }}
                        value={endDateInput}
                      />
                    </Form.Field>
                  </Form>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
  );
}

export default CustomQuerySearchTool;
