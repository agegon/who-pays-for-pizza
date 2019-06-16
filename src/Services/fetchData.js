//Return Promise with fetched data:
//  the guests list, the pizza eaters list, the vegans list
//  and the order price in BYN

export const fetchData = () => {
  const urlGuests = "https://gp-js-test.herokuapp.com/pizza";
  const urlDiets = "https://gp-js-test.herokuapp.com/pizza/world-diets-book/"; //+Anton%20Chehov,Vladimir%20Pushkin
  const urlOrderPizza = "https://gp-js-test.herokuapp.com/pizza/order/"; //+type/number
  const urlOrderCola = "https://gp-js-test.herokuapp.com/pizza/order-cola/"; //+number
  const urlCurrency = "https://gp-js-test.herokuapp.com/pizza/currency";

  const data = {};

  return fetch(urlGuests)
    .then(response => response.json())
    .then(response => {
      if ("party" in response) {
        data.partyGuests = response.party.map(i => i.name);
        data.pizzaEaters = response.party
          .filter(i => i.eatsPizza)
          .map(i => i.name);
        return data.pizzaEaters;
      } else {
        throw new TypeError("Fetched data about guests is incorrect.");
      }
    })
    .then(pizzaEaters => {
      const names = encodeURI(pizzaEaters.join(","));
      const url = urlDiets + names;
      return fetch(url);
    })
    .then(response => response.json())
    .then(response => {
      if ("diet" in response) {
        data.vegans = response.diet.filter(i => i.isVegan).map(i => i.name);
        data.pizzaType = selectPizza(
          data.vegans.length,
          data.pizzaEaters.length
        );
      } else {
        throw new TypeError("Fetched data about diets is incorrect.");
      }
    })
    .then(() => {
      return Promise.all([
        fetch(urlOrderPizza + data.pizzaType + `/${data.pizzaEaters.length}`),
        fetch(urlOrderCola + data.pizzaEaters.length),
        fetch(urlCurrency)
      ]);
    })
    .then(async ([pizza, cola, currency]) => {
      const order = {};
      order.pizza = await pizza.json();
      order.cola = await cola.json();
      order.currency = await currency.json();
      return order;
    })
    .then(order => {
      const pizzaPrice = calculatePrice(order.pizza.price, order.currency);
      const colaPrice = calculatePrice(order.cola.price, order.currency);
      data.orderPrice = roundDec(pizzaPrice + colaPrice);
      data.pizzaName = order.pizza.name;
      data.requestFailed = false;
      return data;
    })
    .catch(er => {
      console.log(
        "There has been a problem with fetch operation: " + er.message
      );
      data.requestFailed = true;
      return data;
    });
};

//Select the type of Pizza
const selectPizza = (vegans, all) => {
  const vegeterian = ["vegan", "cheese"];
  const notVegeterian = ["meat"];
  const getRandom = arr => {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
  };
  if (vegans / all >= 0.51) return getRandom(vegeterian);
  else return notVegeterian[0];
};

//Converts price into BYN at the exchange rate
const calculatePrice = (price, currency) => {
  const priceArr = price.split(" ");
  let result = parseFloat(priceArr[0]);
  result = result * currency[priceArr[1]];
  return result;
};

//This function rounds number with desired decimal
export const roundDec = (num, dec = 1) => {
  const k = Math.pow(10, dec);
  return Math.round(num * k) / k;
};

//This function rounds number to larger with desired decimal
export const roundDecUp = (num, dec = 1) => {
  const k = Math.pow(10, dec);
  const r = Math.floor(num * k);
  if (r < num * k) return (r + 1) / k;
  return r / k;
};
