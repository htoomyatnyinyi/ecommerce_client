import React, { useState } from "react";

const Products: React.FC = () => {
  const [cars, setCars] = useState<any>([]);

  // add data
  const [year, setYear] = useState(new Date().getFullYear());
  const [model, setModel] = useState("");
  const [manufacture, setManufacture] = useState("");
  // console.log(cars, year, model, manufacture);
  console.log(cars);

  const handleAdd = () => {
    const newCar = {
      // a: year,
      b: model,
      c: manufacture,
    };

    setCars((data: any) => [...data, newCar]);
  };

  return (
    <div className="h-screen">
      <div className="container mx-auto">
        <div className="flex-col">
          <div className="p-2 m-1 bg-blue-400">
            {cars.map((car: any, index) => (
              <div key={index}>
                <p>{car.b}</p>
                <p>{car.c}</p>
              </div>
            ))}
          </div>
          <input
            type="date"
            // onChange={(d) => setYear(d.target.value)}
            className="p-2 border"
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 border"
          />
          <input
            type="text"
            value={manufacture}
            onChange={(e) => setManufacture(e.target.value)}
            className="p-2 border"
          />
          <button onClick={handleAdd} className="p-2 m-1 bg-green-500">
            Add to Array
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
