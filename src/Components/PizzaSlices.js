import React, { Component } from "react";

import "./PizzaSlices.css";

export default class PizzaSlices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGuests: false,
      showEaters: false
    };
  }
  guestsClick = () => {
    this.setState({ showGuests: !this.state.showGuests });
  };
  eatersClick = () => {
    this.setState({ showEaters: !this.state.showEaters });
  };
  render() {
    const slices = this.props.eaters.length;
    const guests = this.props.guests.length;
    const guestsNames = this.props.guests.join(", ");
    const eatersNames = this.props.eaters.join(", ");
    let { type, name } = this.props;
    type = type[0].toUpperCase() + type.slice(1);
    name = name.toUpperCase();
    const pepperoni = [];
    for (let i = 0; i < 7; i++) {
      pepperoni.push((360 / 7) * i);
    }
    const cuts = [];
    for (let i = 1; i <= slices; i++) {
      cuts.push((360 / slices) * i);
    }
    return (
      <div>
        <h2>{name}</h2>
        <h2>
          {type} Pizza for {numToWord(slices)}
        </h2>
        <div className="pizza">
          <div className="cheese" />
          {pepperoni.map((item, i) => (
            <div
              key={`pepperoni-${i}`}
              className="pepperoni"
              style={{ transform: `rotate(${item}deg)` }}
            />
          ))}
          {cuts.map((item, i) => (
            <div
              key={`cut-${i}`}
              className="cut"
              style={{ transform: `rotate(${item}deg)` }}
            />
          ))}
        </div>
        <div className="info">
          <h3 onClick={this.guestsClick} title="Click for details.">
            {guests} people will come to the Party!
          </h3>
          <p className={this.state.showGuests ? null : "hidden"}>
            At the party will come: {guestsNames}.
          </p>
          <h3 onClick={this.eatersClick} title="Click for details.">
            And {slices} of them will eat the Pizza!
          </h3>
          <p className={this.state.showEaters ? null : "hidden"}>
            Will eat the Pizza: {eatersNames}.
          </p>
        </div>
      </div>
    );
  }
}

//simple function to convert numbers into words
const numToWord = num => {
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen"
  ];
  if (num >= 0 && num <= 19) {
    return ones[num];
  }
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety"
  ];
  if (num >= 20 && num < 100) {
    let str = tens[Math.floor(num / 10)];
    if (num % 10 !== 0) str += ` ${ones[num % 10]}`;
    return str;
  }
  return num;
};
