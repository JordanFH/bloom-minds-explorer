const DatePicker = ({ selectedDate, onDateChange }) => {
  // Formateamos la fecha al formato YYYY-MM-DD que el input[type=date] requiere
  const dateValue = selectedDate.toISOString().split("T")[0];

  // La fecha máxima seleccionable es ayer (los datos de GIBS suelen tener 1-2 días de retraso)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);
  const maxDateValue = maxDate.toISOString().split("T")[0];

  const handleDateChange = (e) => {
    // Creamos un nuevo objeto Date a partir del valor del input.
    // Añadimos 'T00:00:00' para evitar problemas con la zona horaria.
    const newDate = new Date(`${e.target.value}T00:00:00`);
    onDateChange(newDate);
  };

  return (
    <div className="mb-3 pb-3 border-b border-gray-200">
      <p className="text-xs font-semibold mb-2 text-gray-700">Fecha de Visualización:</p>
      <input
        type="date"
        className="w-full p-2 border border-gray-300 rounded-md text-sm"
        value={dateValue}
        max={maxDateValue}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DatePicker;
