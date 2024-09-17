import React, { useState, useEffect } from "react";
import Pizza from "../pizza-table/pizza";
import "./topping.css";

export default function Topping() {
  const [toppings, setToppings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newTopping, setNewTopping] = useState("");
  const [newToppingInput, setNewToppingInput] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("toppings")) || [];
    setToppings(data);
  }, []);

  useEffect(() => {
    if (toppings.length > 0) {
      localStorage.setItem("toppings", JSON.stringify(toppings));
    }
  }, [toppings]);

  const handleEmptyToppings = () => {
    localStorage.setItem("toppings", JSON.stringify([]));
  };

  const handleRemovePizzaTopping = (value) => {
    const data = JSON.parse(localStorage.getItem("pizzas"));
    value.trim();
    const dataToppings = data.map((topping) => topping.toppings);
    console.log(dataToppings.filter((topping) => topping !== value));
  };

  const deleteTopping = (toppingToDelete) => {
    const updatedToppings = toppings.filter(
      (topping) => topping.name !== toppingToDelete
    );
    handleRemovePizzaTopping(toppingToDelete);
    // if (updatedToppings.length === 0) {
    //   handleEmptyToppings();
    // }
    // setToppings(updatedToppings);
  };

  const editTopping = (toppingToEdit) => {
    setEditing(toppingToEdit);
    setNewTopping(toppingToEdit);
  };

  const saveTopping = () => {
    const updatedToppings = toppings.map((topping) =>
      topping.name === editing ? { ...topping, name: newTopping } : topping
    );
    setToppings(updatedToppings);
    setEditing(null);
  };

  const addTopping = () => {
    const toppingExists = toppings.some(
      (topping) => topping.name.toLowerCase() === newToppingInput.toLowerCase()
    );

    if (!toppingExists && newToppingInput.trim() !== "") {
      setToppings([
        ...toppings,
        { name: newToppingInput.trim(), selected: false },
      ]);
      setNewToppingInput("");
    } else {
      alert("This topping already exists or input is invalid!");
    }
  };

  return (
    <div className="topping-container">
      <h1>Topping List</h1>
      <div className="add-topping-container">
        <input
          type="text"
          value={newToppingInput}
          onChange={(e) => setNewToppingInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTopping();
            }
          }}
          placeholder="Add new topping"
        />
        <button onClick={addTopping}>Add</button>
      </div>
      <table>
        <tbody>
          {toppings
            .sort((a, b) => a.id - b.id)
            .map((topping, idx) => (
              <tr key={topping.name}>
                <td id="idx">{idx + 1}</td>
                <td>
                  {editing === topping.name ? (
                    <input
                      type="text"
                      value={newTopping}
                      onChange={(e) => setNewTopping(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveTopping();
                        }
                      }}
                    />
                  ) : (
                    topping.name
                  )}
                </td>

                <td className="topping-list">
                  {editing === topping.name ? (
                    <button onClick={saveTopping}>Save</button>
                  ) : (
                    <button onClick={() => editTopping(topping.name)}>
                      Edit
                    </button>
                  )}

                  <button onClick={() => deleteTopping(topping.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Pizza toppings={toppings} />
    </div>
  );
}
