"use client";

import { useState } from "react";

const ColorPicker = () => {
  const [color, setColor] = useState("#563d7c");

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <div className="mb-3">
      <label htmlFor="exampleColorInput" className="form-label">
        Color picker
      </label>
      <input
        type="color"
        className="form-control form-control-color"
        id="exampleColorInput"
        value={color}
        onChange={handleColorChange}
        title="Choose your color"
      />
    </div>
  );
};

export default ColorPicker;
