"use client";

import { useEffect, useState } from "react";
import { Task as TTask } from "./[task]/page";
import { v4 as uuidv4 } from "uuid";
import Input from "./shared/components/Input";
import Task from "./components/Task";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tasks, updateTasks] = useState<TTask[]>([]);
  const [isInitialized, updateIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("data") ?? "[]") as TTask[];
    updateTasks(tasks);
    updateIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("data", JSON.stringify(tasks));
  }, [tasks, isInitialized]);

  const handleAddTask = (name: string) => {
    if (!name) return;
    updateTasks([...tasks, { id: uuidv4(), name, todos: [] }]);
  };

  const handleClick = (id: string) => {
    router.push(`/${id}`);
  };

  const handleDelete = (id: string) => {
    if (
      !confirm(
        "Are you sure?, This task and all todos inside it will be deleted!",
      )
    )
      return;

    const task = tasks.find((el) => el.id === id);

    if (!task) return;

    updateTasks(tasks.filter((el) => el.id !== id));
  };

  const handleEdit = (id: string) => {
    const task = tasks.find((el) => el.id === id);

    if (!task) return;

    const label = prompt("Update task: ", task.name);
    if (!label) return;

    task.name = label;

    tasks.forEach((el) => {
      if (el.id === id) {
        el.name = label;
      }
    });

    updateTasks([...tasks]);
  };

  const taskList = tasks.map((el, i) => {
    return (
      <div
        key={el.id}
        className={
          i !== tasks.length - 1
            ? "border-b border-slate-500 p-2 pl-0"
            : "p-2 pl-0"
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

  const loadingTemplate = (
    <div className="h-full w-full text-white flex flex-col items-center justify-center">
      <svg
        className="h-6 w-6 animate-spin-slow duration-1000 text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
      >
        <path
          opacity=".4"
          d="M65.6 414.4c0 8.2 3.1 16.4 9.4 22.6c12.5 12.5 32.8 12.5 45.3 0l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L75 391.8c-6.2 6.2-9.4 14.4-9.4 22.6zM224 416l0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32zM346.5 120.2c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L437 120.2c12.5-12.5 12.5-32.8 0-45.3c-6.2-6.2-14.4-9.4-22.6-9.4s-16.4 3.1-22.6 9.4l-45.3 45.3zm0 226.3c-12.5 12.5-12.5 32.8 0 45.3L391.8 437c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0zM384 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32z"
        />
        <path d="M256 0c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64c0-17.7-14.3-32-32-32zM0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32zM120.2 75C107.7 62.5 87.5 62.5 75 75s-12.5 32.8 0 45.3l45.3 45.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L120.2 75z" />
      </svg>
    </div>
  );

  return (
    <div className="h-dvh w-full bg-slate-900 text-white flex flex-col items-center">
      <div className="flex h-full flex-col gap-3 w-[28rem] items-start max-h-full py-5 pl-5 pr-3">
        <div className="w-full pr-2">
          <Input placeholder="Add task" onSubmit={handleAddTask} />
        </div>
        <div className="h-2"></div>
        <span className="mb-2 text-lg font-semibold text-white">Tasks:</span>
        <ul className="max-w-md list-inside text-gray-400 h-full overflow-auto w-full pr-1">
          {!isInitialized
            ? loadingTemplate
            : tasks.length
              ? taskList
              : "No tasks yet"}
        </ul>
      </div>
    </div>
  );
}
