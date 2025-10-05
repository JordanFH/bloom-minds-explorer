const DatePicker = ({ selectedDate, onDateChange }) => {
  // Es posible que `selectedDate` sea inválido si el estado se corrompe,
  // así que nos aseguramos de no fallar aquí.
  const dateValue =
    selectedDate && !Number.isNaN(selectedDate.getTime())
      ? selectedDate.toISOString().split("T")[0]
      : "";

  const maxDate = new Date();
  // Usamos el retraso seguro de 3 días que establecimos antes
  maxDate.setDate(maxDate.getDate() - 3);
  const maxDateValue = maxDate.toISOString().split("T")[0];

  const handleDateChange = (e) => {
    const dateString = e.target.value;

    // Si el usuario borra la fecha, el valor es un string vacío.
    // En este caso, no hacemos nada para evitar un error.
    if (!dateString) {
      return;
    }

    // Creamos la fecha tentativa
    const newDate = new Date(`${dateString}T00:00:00`);

    // ===== VALIDACIÓN CLAVE =====
    // `isNaN(date.getTime())` es la forma estándar y más segura en JavaScript
    // para comprobar si un objeto Date es válido.
    // Si no es válido (ej: por un input vacío o corrupto), simplemente no actualizamos el estado.
    if (Number.isNaN(newDate.getTime())) {
      return;
    }

    // Solo si la fecha es válida, llamamos a la función del padre.
    onDateChange(newDate);
  };

  return (
    <div className="mb-3 pb-3 border-b border-gray-200">
      <p className="text-xs font-semibold mb-2 text-gray-700">Viewing Date:</p>
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
