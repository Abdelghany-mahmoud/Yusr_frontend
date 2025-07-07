import { useTranslation } from "react-i18next";

export default function TaskList({ tasks = [] }) {
  const { t } = useTranslation("layout");

  if (!Array.isArray(tasks)) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">{t("related_tasks")}:</h3>
      {tasks.length > 0 ? (
        <ul className="list-disc list-inside">
          {tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">{t("no_related_tasks")}</p>
      )}
    </div>
  );
}
