import React, { useState, useEffect } from "react";
import "./pizza.css";

export default function Pizza({ toppings }) {
  const [pizzas, setPizzas] = useState([]);
  const [newPizzaName, setNewPizzaName] = useState("");
  const [editingPizzaIndex, setEditingPizzaIndex] = useState(null);
  const [tempPizzaName, setTempPizzaName] = useState("");

  useEffect(() => {
    const savedPizzas = JSON.parse(localStorage.getItem("pizzas")) || [];
    setPizzas(savedPizzas);
  }, []);

  useEffect(() => {
    if (pizzas.length > 0) {
      localStorage.setItem("pizzas", JSON.stringify(pizzas));
    }
  }, [pizzas]);

  const handleEmptyPizzas = () => {
    localStorage.setItem("pizzas", JSON.stringify([]));
  };

  const addPizza = () => {
    if (
      newPizzaName.trim() === "" ||
      pizzas.some(
        (pizza) => pizza.name.toLowerCase() === newPizzaName.toLowerCase()
      )
    ) {
      alert("This pizza already exists or the name is empty.");
      return;
    }

    const updatedPizzas = [
      ...pizzas,
      { name: newPizzaName, toppings: [], selectedTopping: "" },
    ];
    setPizzas(updatedPizzas);
    setNewPizzaName("");
  };

  const deletePizza = (index) => {
    const updatedPizzas = pizzas.filter((_, i) => i !== index);
    if (updatedPizzas.length === 0) {
      handleEmptyPizzas();
    }
    setPizzas(updatedPizzas);
  };

  const editPizza = (index) => {
    setEditingPizzaIndex(index);
    setTempPizzaName(pizzas[index].name);
  };

  const savePizzaName = (index) => {
    const updatedPizzas = pizzas.map((pizza, i) =>
      i === index ? { ...pizza, name: tempPizzaName } : pizza
    );
    setPizzas(updatedPizzas);
    setEditingPizzaIndex(null);
  };

  const addToppingToPizza = (pizzaIndex) => {
    const pizza = pizzas[pizzaIndex];
    if (pizza.toppings.includes(pizza.selectedTopping)) {
      alert("This topping has already been added.");
      return;
    }
    if (pizza.selectedTopping === "") {
      alert("Please select a topping before adding.");
      return;
    }

    const updatedPizzas = pizzas.map((pizza, i) =>
      i === pizzaIndex
        ? {
            ...pizza,
            toppings: [...pizza.toppings, pizza.selectedTopping],
            selectedTopping: "",
          }
        : pizza
    );
    setPizzas(updatedPizzas);
  };

  const selectedToppingHandler = (pizzaIndex, value) => {
    const updatedPizzas = pizzas.map((pizza, i) =>
      i === pizzaIndex ? { ...pizza, selectedTopping: value } : pizza
    );
    setPizzas(updatedPizzas);
  };

  const removeTopping = (pizzaIndex, toppingIndex) => {
    const updatedPizzas = pizzas.map((pizza, i) => {
      if (i === pizzaIndex) {
        const updatedToppings = pizza.toppings.filter(
          (_, tIndex) => tIndex !== toppingIndex
        );
        return { ...pizza, toppings: updatedToppings };
      }
      return pizza;
    });
    setPizzas(updatedPizzas);
  };

  return (
    <div className="pizza-container">
      <div>Create a New Pizza</div>
      <input
        type="text"
        placeholder="Pizza Name"
        value={newPizzaName}
        onChange={(e) => setNewPizzaName(e.target.value)}
      />
      <button onClick={addPizza}>Create</button>

      <div className="pizza-list">
        {pizzas.map((pizza, index) => (
          <div key={index} className="pizza-item">
            {editingPizzaIndex === index ? (
              <div>
                <input
                  type="text"
                  value={tempPizzaName}
                  onChange={(e) => setTempPizzaName(e.target.value)}
                />
                <button onClick={() => savePizzaName(index)}>Save</button>
                <button onClick={() => setEditingPizzaIndex(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3>{pizza.name}</h3>
                <button onClick={() => editPizza(index)}>Edit</button>
              </div>
            )}

            <ul>
              {pizza.toppings.map((topping, toppingIndex) => (
                <li key={toppingIndex}>
                  {topping}
                  <button onClick={() => removeTopping(index, toppingIndex)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <select
              value={pizza.selectedTopping}
              onChange={(e) => selectedToppingHandler(index, e.target.value)}
            >
              <option value="">Select Topping</option>
              {toppings.map((topping, toppingIndex) => (
                <option key={toppingIndex} value={topping.name}>
                  {topping.name}
                </option>
              ))}
            </select>

            <button onClick={() => addToppingToPizza(index)}>
              Add Topping
            </button>

            <button onClick={() => deletePizza(index)}>Delete Pizza</button>
          </div>
        ))}
      </div>
    </div>
  );
}
