const employees = ["موظف أ", "موظف ب", "موظف ج"];

export default function TransactionTransferDialog({ transaction, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h3 className="font-bold mb-4">تحويل المعاملة</h3>
        <p className="mb-2">حدد الموظف الجديد:</p>
        <select className="select select-bordered w-full mb-4">
          {employees.map((emp) => (
            <option key={emp}>{emp}</option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">
            إلغاء
          </button>
          <button className="btn btn-success">تحويل</button>
        </div>
      </div>
    </div>
  );
}
