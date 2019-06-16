import React, { Component } from "react";
import { fetchData } from "../Services/fetchData";
import PizzaSlices from "./PizzaSlices";
import PizzaPay from "./PizzaPay";

import "./App.css";

const initialState = {
  partyGuests: null,
  pizzaEaters: null,
  vegans: null,
  pizzaType: null,
  pizzaName: null,
  orderPrice: null
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoaded: false,
      requestFailed: false,
      ...initialState
    };
  }

  clickLoad = () => {
    this.setState({
      isLoading: true,
      isLoaded: false,
      requestFailed: false
    });
    fetchData().then(obj => {
      if (obj.requestFailed)
        this.setState({
          isLoading: false,
          requestFailed: true
        });
      else
        this.setState({
          isLoading: false,
          isLoaded: true,
          ...obj
        });
    });
  };

  render() {
    const {
      isLoading,
      isLoaded,
      requestFailed,
      partyGuests,
      pizzaEaters,
      vegans,
      orderPrice,
      pizzaType,
      pizzaName
    } = this.state;
    return (
      <div className="flex-wrap">
        <button
          id="load-btn"
          onClick={this.clickLoad}
          disabled={isLoading}
          className={isLoading ? "btn loading" : "btn"}
        >
          Load party!
        </button>
        {isLoading && <p className="loading-text">Wait...</p>}
        {isLoaded && (
          <PizzaSlices
            guests={partyGuests}
            eaters={pizzaEaters}
            type={pizzaType}
            name={pizzaName}
          />
        )}
        {isLoaded && (
          <PizzaPay eaters={pizzaEaters} vegans={vegans} order={orderPrice} />
        )}
        {requestFailed && (
          <div className="error">
            <h3>Something went wrong :(</h3>
            <p>Try again later...</p>
          </div>
        )}
      </div>
    );
  }
}
