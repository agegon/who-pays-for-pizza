import React, { Component } from "react";
import { roundDec, roundDecUp } from "../Services/fetchData";

import "./PizzaPay.css";

export default class PizzaPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eaters: this.props.eaters.map(i => {
        const name = i;
        const toPay = roundDecUp(this.props.order / this.props.eaters.length);
        const isVegan = this.props.vegans.indexOf(name) !== -1;
        return { name, toPay, isVegan };
      }),
      order: this.props.order,
      collected: 0
    };
  }

  payClick = i => {
    const eaters = [...this.state.eaters];
    const collected = roundDec(this.state.collected + eaters[i].toPay);
    eaters[i] = { ...eaters[i] };
    eaters[i].toPay = 0;
    this.setState({ eaters, collected });
  };

  render() {
    const { eaters, order, collected } = this.state;
    const toCollect = order > collected ? roundDec(order - collected) : 0;
    return (
      <table className="pay-pizza">
        <caption>
          Let's calculate how much someone should pay for pizza and cola:
        </caption>
        <tbody>
          <tr className="gray">
            <th>Name</th>
            <th>Share to pay</th>
            <th>Pay</th>
          </tr>
          {eaters.map((item, i) => (
            <tr key={`eaters-${i}`}>
              <td className={item.isVegan ? "vegan" : null}>{item.name}</td>
              <td>{item.toPay} BYN</td>
              <td>
                <button
                  disabled={!item.toPay}
                  className={!item.toPay ? "paid" : null}
                  onClick={item.toPay ? () => this.payClick(i) : null}
                >
                  {!item.toPay ? "PAID" : "PAY"}
                </button>
              </td>
            </tr>
          ))}
          <tr className="gray">
            <td>
              <strong>Total order</strong>
            </td>
            <td>
              <strong>{order} BYN</strong>
            </td>
            <td />
          </tr>
          <tr>
            <td>Money to collect</td>
            <td>{toCollect} BYN</td>
            <td />
          </tr>
          <tr>
            <td>Money collected</td>
            <td>{collected} BYN</td>
            <td />
          </tr>
          {collected > order && (
            <tr>
              <td>Tips for courier :)</td>
              <td>{roundDec(collected - order)} BYN</td>
              <td />
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
