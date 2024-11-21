"use client";

import { useEffect, useState } from "react";
import { Task as TTask } from "./[task]/page";
import { v4 as uuidv4 } from "uuid";
import Input from "./shared/components/Input";
import Task from "./components/Task";

export default function Home() {
  const [tasks, updateTasks] = useState<TTask[]>([]);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("data") ?? "[]") as TTask[];

    updateTasks(tasks.filter((el) => el.name));
  }, []);

  const handleAddTask = (name: string) => {
    if (!name) return;

    updateTasks([...tasks, { id: uuidv4(), name, todos: [] }]);
  };

  const handleClick = () => {};
  const handleDelete = () => {};
  const handleEdit = () => {};

  const taskList = tasks.map((el, i) => {
    return (
      <div
        key={el.id}
        className={
          i !== tasks.length - 1 ? "border-b border-slate-500 p-2" : "p-2"
        }
      >
        <Task
          task={el}
          onClick={handleClick}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    );
  });

  return (
    <div className="h-[100vh] w-full bg-slate-900 text-white flex flex-col items-center">
      <div className="flex flex-col gap-3 w-[28rem] items-start max-h-full py-5 pl-5 pr-3">
        <div className="w-full pr-2">
          <Input onSubmit={handleAddTask} />
        </div>
        <div className="h-2"></div>
        <span className="mb-2 text-lg font-semibold text-white">Tasks:</span>
        <ul className="max-w-md list-inside text-gray-400 h-full overflow-auto w-full pr-1">
          {tasks.length ? taskList : "No tasks yet"}
        </ul>
      </div>
    </div>
  );
}
